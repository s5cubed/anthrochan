'use strict';

const { Boards, Accounts } = require(__dirname+'/../../db/')
	, dynamicResponse = require(__dirname+'/../../lib/misc/dynamic.js');

module.exports = async (req, res) => {

	const { __ } = res.locals;

	await Promise.all([
		Accounts.removeTrustedBoard(req.body.checkedtrusted, res.locals.board._id),
		Boards.removeTrusted(res.locals.board._id, req.body.checkedtrusted),
	]);

	return dynamicResponse(req, res, 200, 'message', {
		'title': __('Success'),
		'message': __('Deleted user'),
		'redirect': `/${req.params.board}/manage/trusted.html`,
	});

};