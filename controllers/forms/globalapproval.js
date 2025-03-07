'use strict';

const config = require(__dirname+'/../../lib/misc/config.js')
	, approvalHandler = require(__dirname+'/../../lib/approval/approval.js')
	, paramConverter = require(__dirname+'/../../lib/middleware/input/paramconverter.js');

module.exports = {
	paramConverter: paramConverter({
	}),

	controller: async (req, res, next) => {

		const { __ } = res.locals;

		const { globalLimits } = config.get;

		if (req.body.action) {
			if (req.body.action === 'approve') {
				try {
					await approvalHandler.approve(req, res);
					return res.redirect(req.headers.referer);
				} catch (error) {
					next(error);
				}
			} else {
				try {
					return await approvalHandler.deny(req, res);
				} catch (error) {
					next(error);
				}
			}
		}
	}

};
