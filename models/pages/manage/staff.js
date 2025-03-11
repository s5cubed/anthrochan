'use strict';

module.exports = async (req, res) => {

	res
//	.set('Cache-Control', 'private, max-age=1')
		.render('managestaff', {
			csrf: req.csrfToken(),
			permissions: res.locals.permissions,
			board: res.locals.board,
			user: res.locals.user,
		});

};
