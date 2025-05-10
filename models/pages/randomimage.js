'use strict';

const Posts = require(__dirname+'/../../db/posts.js');

module.exports = async (req, res, next) => {

	let randimage;
	try {
		randimage = await Posts.randomImage();
	} catch (err) {
		return next(err);
	}

	if (!randimage) {
		return res.redirect('/file/defaultrandomimage.png');
	}

	return res.redirect(`/file/${randimage}`);

};
