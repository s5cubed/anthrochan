'use strict';

const { Posts } = require(__dirname+'/../../../db/index.js')
	, { Permissions } = require(__dirname+'/../../../lib/permission/permissions.js');

module.exports = async (req, res, next) => {
	let posts = null;
	try {
		posts = await Posts.getFilesPending();
	} catch (err) {
		return next(err);
	}

	res.set('Cache-Control', 'private, max-age=1');

	res.render('globalmanageapproval', {
		csrf: req.csrfToken(),
		permissions: res.locals.permissions,
		viewRawIp: res.locals.permissions.get(Permissions.VIEW_RAW_IP),
		posts,
	});
};
