'use strict';

const Posts = require(__dirname+'/../../db/posts.js');

module.exports = async (req, res, next) => {

	let tegaki;
	try {
		tegaki = await Posts.randomTegaki();
	} catch (err) {
		return next(err);
	}

	if (!tegaki) {
		return res.redirect('/file/defaultbanner.png');
	}

	return res.redirect(`/file/${tegaki[0].file.filename}`);

};
