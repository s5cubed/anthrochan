'use strict';

//Note: if I drastically change permissions lib in future this might break. hmmmmm......
const { Permissions } = require(__dirname+'/../lib/permission/permissions.js')
	, Permission = require(__dirname+'/../lib/permission/permission.js')
	, { Binary } = require('mongodb');

module.exports = async(db, redis) => {

	const ANON = new Permission();
	ANON.setAll([
		Permissions.USE_MARKDOWN,
	]);

	const BOARD_STAFF_DEFAULTS = new Permission(ANON.base64);
	BOARD_STAFF_DEFAULTS.setAll([
		Permissions.MANAGE_BOARD_GENERAL,
		Permissions.MANAGE_BOARD_BANS,
		Permissions.MANAGE_BOARD_LOGS,
	]);

	const BOARD_STAFF = new Permission(BOARD_STAFF_DEFAULTS.base64);

	const BOARD_OWNER_DEFAULTS = new Permission(BOARD_STAFF.base64);
	BOARD_OWNER_DEFAULTS.setAll([
		Permissions.MANAGE_BOARD_OWNER,
		Permissions.MANAGE_BOARD_STAFF,
		Permissions.MANAGE_BOARD_CUSTOMISATION,
		Permissions.MANAGE_BOARD_SETTINGS,
	]);

	const BOARD_OWNER = new Permission(BOARD_OWNER_DEFAULTS.base64);

	const GLOBAL_STAFF = new Permission(BOARD_OWNER.base64);
	GLOBAL_STAFF.setAll([
		Permissions.MANAGE_GLOBAL_GENERAL,
		Permissions.MANAGE_GLOBAL_BANS,
		Permissions.MANAGE_GLOBAL_LOGS,
		Permissions.MANAGE_GLOBAL_NEWS,
		Permissions.MANAGE_GLOBAL_BOARDS,
		Permissions.MANAGE_GLOBAL_SETTINGS,
		Permissions.MANAGE_BOARD_OWNER,
		Permissions.BYPASS_FILTERS,
		Permissions.BYPASS_BANS,
		Permissions.BYPASS_SPAMCHECK,
		Permissions.BYPASS_RATELIMITS,
	]);

	const ADMIN = new Permission(GLOBAL_STAFF.base64);
	ADMIN.setAll([
		Permissions.CREATE_BOARD,
		Permissions.CREATE_ACCOUNT,
		Permissions.MANAGE_GLOBAL_ACCOUNTS,
		Permissions.MANAGE_GLOBAL_ROLES,
		Permissions.USE_MARKDOWN_IMAGE,
	]);

	const ROOT = new Permission();
	ROOT.setAll(Permission.allPermissions);

	console.log('Removing unnecessary unique index on roles db');
	await db.collection('roles').deleteMany({});

	console.log('Adding missing defaults "roles" to db');
	await db.collection('roles').insertMany([
		{ name: 'ANON', permissions: Binary(ANON.array) },
		{ name: 'BOARD_STAFF', permissions: Binary(BOARD_STAFF.array) },
		{ name: 'BOARD_OWNER', permissions: Binary(BOARD_OWNER.array) },
		{ name: 'BOARD_STAFF_DEFAULTS', permissions: Binary(BOARD_STAFF_DEFAULTS.array) },
		{ name: 'BOARD_OWNER_DEFAULTS', permissions: Binary(BOARD_OWNER_DEFAULTS.array) },
		{ name: 'GLOBAL_STAFF', permissions: Binary(GLOBAL_STAFF.array) },
		{ name: 'ADMIN', permissions: Binary(ADMIN.array) },
		{ name: 'ROOT', permissions: Binary(ROOT.array) },
	]);

	console.log('Clearing globalsettings cache');
	await redis.deletePattern('globalsettings');
	console.log('Clearing sessions and users cache');
	await redis.deletePattern('users:*');
	await redis.deletePattern('sess:*');

};
