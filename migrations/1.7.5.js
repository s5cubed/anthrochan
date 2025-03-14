'use strict';

const { Permissions } = require(__dirname+'/../lib/permission/permissions.js')
	, Permission = require(__dirname+'/../lib/permission/permission.js')
	, { Binary } = require('mongodb');

module.exports = async(db, redis) => {

	const ANON = new Permission();
	ANON.setAll([
		Permissions.CREATE_ACCOUNT,
		Permissions.USE_MARKDOWN_GENERAL,
	]);

	const TRUSTED_USER = new Permission(ANON.base64);
	TRUSTED_USER.setAll([
		Permissions.BYPASS_CAPTCHA,
		Permissions.BYPASS_FILE_APPROVAL,
	]);

	const BOARD_STAFF_DEFAULTS = new Permission(TRUSTED_USER.base64);
	BOARD_STAFF_DEFAULTS.setAll([
		Permissions.MANAGE_BOARD_GENERAL,
		Permissions.MANAGE_BOARD_BANS,
		Permissions.MANAGE_BOARD_LOGS,
		Permissions.VIEW_BOARD_GLOBAL_BANS,
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
	
	const GLOBAL_STAFF = new Permission(BOARD_STAFF.base64);
	GLOBAL_STAFF.setAll([
		Permissions.BYPASS_BANS,

		Permissions.MANAGE_GLOBAL_GENERAL,
		Permissions.MANAGE_GLOBAL_LOGS,
		Permissions.MANAGE_GLOBAL_BANS,
	]);

	const ADMIN = new Permission();
	ADMIN.setAll(Permission.allPermissions);

	const ROOT = new Permission();
	ROOT.setAll(Permission.allPermissions);

	console.log('Clearing existing roles');
	await db.collection('roles').deleteMany({});

	console.log('Adding Anon, Trusted User, Board staff, Board owner, Global Staff, Admin, Root roles');
	await db.collection('roles').insertMany([
		{ name: 'ANON', permissions: Binary(ANON.array) },
		{ name: 'TRUSTED_USER', permissions: Binary(TRUSTED_USER.array) },
		{ name: 'BOARD_STAFF', permissions: Binary(BOARD_STAFF.array) },
		{ name: 'BOARD_OWNER', permissions: Binary(BOARD_OWNER.array) },
		{ name: 'BOARD_STAFF_DEFAULTS', permissions: Binary(BOARD_STAFF_DEFAULTS.array) },
		{ name: 'BOARD_OWNER_DEFAULTS', permissions: Binary(BOARD_OWNER_DEFAULTS.array) },
		{ name: 'GLOBAL_STAFF', permissions: Binary(GLOBAL_STAFF.array) },
		{ name: 'ADMIN', permissions: Binary(ADMIN.array) },
		{ name: 'ROOT', permissions: Binary(ROOT.array) },
	]);
	
	console.log('Adding \'trusted\' to boards');
	await db.collection('boards').updateMany(
		{ trusted: { $exists: false } },
		{ $set: { trusted: {} } }
	);
	
	console.log('Updating accounts with \'trustedBoards\'');
	await db.collection('accounts').updateMany(
		{ trustedBoards: { $exists: false } },
		{ $set: { trustedBoards: [] } }
	);

	console.log('Clearing globalsettings cache');
	await redis.deletePattern('globalsettings');
	console.log('Clearing sessions and users cache');
	await redis.deletePattern('users:*');
	await redis.deletePattern('sess:*');
};