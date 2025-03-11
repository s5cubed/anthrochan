'use strict';

module.exports = async (req, res) => {

	res
		.set('Cache-Control', 'private, max-age=1')
		.render('manageassets', {
			csrf: req.csrfToken(),
		});

};
