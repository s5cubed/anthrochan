'use strict';

const { Boards, Accounts } = require(__dirname+'/../../db/')
	, dynamicResponse = require(__dirname+'/../../lib/misc/dynamic.js')
	, roleManager = require(__dirname+'/../../lib/permission/rolemanager.js');

module.exports = async (req, res) => {

	const { __ } = res.locals;

	await Promise.all([
		Accounts.addTrustedBoard([req.body.username], res.locals.board._id),
		Boards.addTrusted(res.locals.board._id, req.body.username, roleManager.roles.BOARD_STAFF_DEFAULTS)
	]);

	return dynamicResponse(req, res, 200, 'message', {
		'title': __('Success'),
		'message': __('Added user to trusted'),
		'redirect': `/${req.params.board}/manage/trusted.html`,
	});

};
