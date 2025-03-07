'use strict';

const {Approval, Posts, Modlogs, Boards } =require(__dirname+'/../../db/')
    , actionsHandler = require(__dirname+'/../../models/forms/actionhandler.js')
    , actionChecker = require(__dirname+'/../../lib/input/actionchecker.js')
    , { buildThread } = require(__dirname+'/../../lib/build/tasks.js')
    , buildQueue = require(__dirname+'/../../lib/build/queue.js')
    , ModlogActions = require(__dirname+'/../../lib/input/modlogactions.js')
    , Socketio = require(__dirname+'/../../lib/misc/socketio.js');

module.exports = {
    approve: async (req, res) => {
        const filehash = req.body.hash;
        const fileMetadata = await Approval.getFileMetadata(filehash);

        await Posts.db.updateMany(
          { "files.hash": filehash },
          {
            $set: {
              "files.$[file]": fileMetadata,
            }
          },
          {
            arrayFilters: [
              { "file.hash": filehash }  // Only update file in post with matching hash
            ]
          }
        );

        await Approval.approve(filehash);

        //add the edit to the modlog
        await Modlogs.insertOne({
            board: null,
            showLinks: false,
            postLinks: [],
            actions: [ModlogActions.APPROVE],
            public: false,
            date: new Date(),
            showUser: true,
            message: `Approved ${filehash.substring(0, 6)}`,
            user: req.session.user,
            ip: {
                cloak: res.locals.ip.cloak,
                raw: res.locals.ip.raw,
            }
        });

        const updatedPosts = await Posts.db.find({"files.hash" : filehash}).toArray();

        if (updatedPosts.length > 0) {
            for (let i = 0; i < updatedPosts.length; i++) {
                const post = updatedPosts[i];

                //emit the edit over websocket so post gets updated live
                Socketio.emitRoom(`${post.board}-${post.thread || post.postId}`, 'approvePost', {
                    postId: post.postId,
                    name: post.name,
                    message: post.message,
                    tripcode: post.tripcode,
                    capcode: post.capcode,
                    email: post.email,
                    subject: post.subject,
                    //existing post props
                    _id: post._id,
                    u: post.u,
                    date: post.date,
                    country: post.country,
                    board: post.board,
                    nomarkup: post.nomarkup,
                    thread: post.thread,
                    spoiler: post.spoiler,
                    banmessage: post.banmessage,
                    userId: post.userId,
                    files: post.files,
                    quotes: post.quotes,
                    backlinks: post.backlinks,
                    replyposts: post.replyposts,
                    replyfiles: post.replyfiles,
                    sticky: post.sticky,
                    locked: post.locked,
                    bumplocked: post.bumplocked,
                    cyclic: post.cyclic,
                });

                const buildOptions = {
                    'threadId': post.thread || post.postId,
                    'board': await Boards.findOne(post.board)
                };

                //build thread immediately for redirect
                await buildThread(buildOptions);

                if (post.thread === null) {
                    //rebuild catalog if its a thread to correct catalog tile
                    buildQueue.push({
                        'task': 'buildCatalog',
                        'options': {
                            'board': post.board,
                        }
                    });
                }
            }
        }
    },

    deny: async (req, res) => {
        const filehash = req.body.hash;
        const user_id = await Approval.getUserId(filehash);

        // Update all pending posts by user to prepare for deletion
        const files = await Approval.getFileMetadataByUserId(user_id);
        console.log(files);
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const fileMetadata = files[i];
                await Posts.db.updateMany(
                   { "files.hash": fileMetadata.hash },
                   {
                     $set: {
                       "files.$[file]": fileMetadata,
                     }
                   },
                   {
                     arrayFilters: [
                       { "file.hash": fileMetadata.hash }  // Only update file in post with matching hash
                     ]
                   }
                );
            }
        }

        await Approval.denyAll(user_id);

        const postsToDelete = await Posts.db.find({"files.hash" : filehash}).toArray();
        console.log(postsToDelete)

        req.headers.referer = '/globalmanage/approval.html';
        // modactions
        req.body.delete_file = true; // delete this file
        req.body.delete_ip_global = true; // delete all posts by this ip
        req.body.global_ban = true; // ban with duration of 1 year
        req.body.log_message = `Denied hash ${filehash.substring(0, 6)}`;
        req.body.ban_reason = `Uploaded hash ${filehash.substring(0, 6)} that was denied`;
        req.body.no_appeal = false;

        res.locals.posts = postsToDelete;
        res.locals.actions = actionChecker(req, res);

        await actionsHandler(req, res);
    },
};