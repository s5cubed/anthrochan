'use strict';

const addTrusted = require(__dirname+'/../../models/forms/addtrusted.js')
	, dynamicResponse = require(__dirname+'/../../lib/misc/dynamic.js')
	, { Accounts } = require(__dirname+'/../../db/')
	, paramConverter = require(__dirname+'/../../lib/middleware/input/paramconverter.js')
	, { checkSchema, lengthBody, existsBody } = require(__dirname+'/../../lib/input/schema.js');

module.exports = {
	paramConverter: paramConverter({
		trimFields: ['username'],
	}),

	controller: async (req, res, next) => {

		const { __ } = res.locals;
		
		const errors = await checkSchema([
			{ result: existsBody(req.body.username), expected: true, error: __('Missing username') },
			{ result: lengthBody(req.body.username, 0, 50), expected: false, error: __('Username must be 50 characters or less') },
			{ result: (res.locals.board.trusted[req.body.username] != null), expected: false, blocking: true, error: __('User is already trusted') },
			{ result: async () => {
				const numAccounts = await Accounts.countUsers([req.body.username]);
				return numAccounts > 0;
			}, expected: true, error: __('User does not exist') },
		]);

		if (errors.length > 0) {
			return dynamicResponse(req, res, 400, 'message', {
				'title': __('Bad request'),
				'errors': errors,
				'redirect': req.headers.referer || `/${req.params.board}/manage/trusted.html`,
			});
		}
		
		try {
			await addTrusted(req, res, next);
		} catch (error) {
			return next(error);
		}
	},

};
