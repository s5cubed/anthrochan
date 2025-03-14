'use strict';

const { isIP } = require('net')
	, { Permissions } = require(__dirname+'/../permission/permissions.js');

module.exports = (query, permissions) => {
	if (query) {
		if (query.ip && typeof query.ip === 'string') {
			const decoded = decodeURIComponent(query.ip);
			//if is IP but no permission, return null
			if (isIP(decoded) && !permissions.get(Permissions.VIEW_RAW_IP)) {
				return null;
			}
			return {ip : decoded}; //otherwise return ip/cloak query
		} else if (query.account && typeof query.account === 'string') {
			const decoded = decodeURIComponent(query.account);
			return {account: decoded};
		} 

		return null;
	}
	
	return null;
};
