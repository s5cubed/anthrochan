'use strict';

const { buildCaptcha } = require(__dirname+'/../../helpers/build.js')
	, uploadDirectory = require(__dirname+'/../../helpers/files/uploadDirectory.js');

module.exports = async (req, res, next) => {

	try {
		await buildCaptcha();
	} catch (err) {
		return next(err);
	}

	return res.sendFile(`${uploadDirectory}html/captcha.html`);

}
