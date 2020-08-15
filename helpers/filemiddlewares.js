'use strict';

const { globalLimits, debugLogs, filterFileNames, spaceFileNameReplacement } = require(__dirname+'/../configs/main.js')
	, dynamicResponse = require(__dirname+'/dynamic.js')
	, uploadLimitFunction = (req, res, next) => {
		return dynamicResponse(req, res, 413, 'message', {
			'title': 'Payload Too Large',
			'message': 'Your upload was too large',
			'redirect': req.headers.referer
		});
	}
	, upload = require('express-fileupload')
	, postFiles = upload({
		debug: debugLogs,
		createParentPath: true,
		safeFileNames: filterFileNames,
		spaceFileNameReplacement,
		preserveExtension: 4,
		limits: {
			totalSize: globalLimits.postFilesSize.max,
			fileSize: globalLimits.postFilesSize.max,
			//files: globalLimits.postFiles.max
		},
		limitHandler: uploadLimitFunction,
		useTempFiles: true,
		tempFileDir: __dirname+'/../tmp/'
	});


module.exports = {

	 handleBannerFiles: upload({
		debug: debugLogs,
		createParentPath: true,
		safeFileNames: filterFileNames,
		spaceFileNameReplacement,
		preserveExtension: 4,
		limits: {
			totalSize: globalLimits.bannerFilesSize.max,
			fileSize: globalLimits.bannerFilesSize.max,
			files: globalLimits.bannerFiles.max
		},
		limitHandler: uploadLimitFunction,
		useTempFiles: true,
		tempFileDir: __dirname+'/../tmp/'
	}),

	handlePostFilesEarlyTor:  (req, res, next) => {
console.log('handlePostFilesEarlyTor')
console.log(res.locals.tor, postFiles)
		if (res.locals.tor) {
			return postFiles(req, res, next);
		}
		return next();
	},

	handlePostFiles: (req, res, next) => {
console.log('handlePostFiles')
		if (res.locals.tor) {
			return next();
		}
		return postFiles(req, res, next);
	},

}
