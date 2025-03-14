'use strict';

const deleteTrusted = require(__dirname+'/../../models/forms/deletetrusted.js')
	, dynamicResponse = require(__dirname+'/../../lib/misc/dynamic.js')
	, paramConverter = require(__dirname+'/../../lib/middleware/input/paramconverter.js')
	, { checkSchema, lengthBody, existsBody } = require(__dirname+'/../../lib/input/schema.js');

module.exports = {

	paramConverter: paramConverter({
		allowedArrays: ['checkedtrusted'],
	}),

	controller: async (req, res, next) => {

		const { __ } = res.locals;
		
		const errors = await checkSchema([
			{ result: lengthBody(req.body.checkedtrusted, 1), expected: false, error: __('Must select at least one user to delete') },
			{ result: existsBody(req.body.checkedtrusted) && req.body.checkedtrusted.some(s => !res.locals.board.trusted[s]), expected: false, error: __('Invalid user selection') },
		]);

		if (errors.length > 0) {
			return dynamicResponse(req, res, 400, 'message', {
				'title': __('Bad request'),
				'errors': errors,
				'redirect': req.headers.referer || `/${req.params.board}/manage/trusted.html`,
			});
		}
		
		try {
			await deleteTrusted(req, res, next);
		} catch (err) {
			return next(err);
		}	
	},

};
