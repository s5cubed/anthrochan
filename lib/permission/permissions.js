'use strict';

const Permissions = Object.seal(Object.freeze(Object.preventExtensions({

	ROOT: 0,

	VIEW_RAW_IP: 1,
	VIEW_RAW_ACCOUNT: 2,

	CREATE_BOARD: 3,
	CREATE_ACCOUNT: 4,

	BYPASS_BANS: 10,
	BYPASS_SPAMCHECK: 11,
	BYPASS_RATELIMITS: 12,
	BYPASS_FILTERS: 13,
	BYPASS_CAPTCHA: 14,
	BYPASS_FILE_APPROVAL: 15,
	BYPASS_DNSBL: 16,
	BYPASS_ANONYMIZER_RESTRICTIONS: 17,

	MANAGE_GLOBAL_GENERAL: 20,
	MANAGE_GLOBAL_LOGS: 21,
	MANAGE_GLOBAL_NEWS: 22,
	MANAGE_GLOBAL_BOARDS: 23,
	MANAGE_GLOBAL_SETTINGS: 24,
	MANAGE_GLOBAL_ACCOUNTS: 25,
	MANAGE_GLOBAL_ROLES: 26,
	MANAGE_GLOBAL_BANS: 27,

	MANAGE_BOARD_OWNER: 30,
	MANAGE_BOARD_GENERAL: 31,
	MANAGE_BOARD_BANS: 32,
	MANAGE_BOARD_LOGS: 33,
	MANAGE_BOARD_SETTINGS: 34,
	MANAGE_BOARD_CUSTOMISATION: 35,
	MANAGE_BOARD_STAFF: 36,
	MANAGE_BOARD_TRUSTED: 37,
	_MANAGE_BOARD_BITS: [14,15,30,31,32,33,34,35,36,37], //bits that can be set by a BO and partial bitfield will be stored in board staff object

	VIEW_BOARD_GLOBAL_BANS: 40,

	USE_MARKDOWN_GENERAL: 50,
	USE_MARKDOWN_IMAGE: 51,
	
})));

const Metadata = Object.seal(Object.freeze(Object.preventExtensions({

	[Permissions.ROOT]: { title: 'Root', label: 'Root', desc: 'Full control. Use with caution!', parents: [Permissions.ROOT] },

	[Permissions.VIEW_RAW_IP]: { title: 'Post information', label: 'View Raw IPs', desc: 'Ability to see raw IPs in moderation interfaces.' },
	[Permissions.VIEW_RAW_ACCOUNT]: { label: 'View account names', desc: 'Ability to see account names in moderation interfaces.' },

	[Permissions.CREATE_BOARD]: { title: 'Create', label: 'Create Board', desc: 'Ability to create new boards.' },
	[Permissions.CREATE_ACCOUNT]: { label: 'Create Account', desc: 'Ability to register an account.' },

	[Permissions.BYPASS_BANS]: { title: 'Bypasses', label: 'Bypass Bans', desc: 'Bypass all bans.' },
	[Permissions.BYPASS_SPAMCHECK]: { label: 'Bypass Spamcheck', desc: 'Bypass the basic anti-flood spamcheck for too frequent similar posting.' },
	[Permissions.BYPASS_RATELIMITS]: { label: 'Bypass Ratelimits', desc: 'Bypass ratelimits for getting new captchas, editing posts, editing board settings, etc.' },
	[Permissions.BYPASS_FILTERS]: { label: 'Bypass Filters', desc: 'Bypass all post filters.' },
	[Permissions.BYPASS_CAPTCHA]: { label: 'Bypass Captcha', desc: 'Bypass captcha.' },
	[Permissions.BYPASS_FILE_APPROVAL]: { label: 'Bypass File Approval', desc: 'Ability to bypass the file approval process.' },
	[Permissions.BYPASS_DNSBL]: { label: 'Bypass DNSBL', desc: 'Bypass DNSBL.' },
	[Permissions.BYPASS_ANONYMIZER_RESTRICTIONS]: { label: 'Bypass Anonymizer Restrictions', desc: 'Bypass anonymizer restrictions e.g. disabled file posting.' },

	[Permissions.MANAGE_GLOBAL_GENERAL]: { title: 'Global Management',label: 'Global Staff', desc: 'General global staff permission. Access to recent posts and reports. Ability to submit global actions.' },
	[Permissions.MANAGE_GLOBAL_BANS]: { label: 'Global Bans', desc: 'Access global bans. Ability to unban, edit, or deny appeals.' },
	[Permissions.MANAGE_GLOBAL_LOGS]: { label: 'Global Logs', desc: 'Access global logs. Ability to search/filter' },
	[Permissions.MANAGE_GLOBAL_NEWS]: { label: 'News', desc: 'Access news posting. Ability to add, edit, or delete newsposts.' },
	[Permissions.MANAGE_GLOBAL_BOARDS]: { label: 'Boards', desc: 'Access the global board list. Ability to search/filter. Also grants the ability to transfer or delete any board.' },
	[Permissions.MANAGE_GLOBAL_SETTINGS]: { label: 'Global Settings', desc: 'Access global settings. Ability to change any settings.' },
	[Permissions.MANAGE_GLOBAL_ACCOUNTS]: { label: 'Accounts', desc: 'Access the accounts list. Ability to search/sort. Ability to edit permissions of any user.', parents: [Permissions.ROOT] },
	[Permissions.MANAGE_GLOBAL_ROLES]: { label: 'Roles', desc: 'Access roles list. Ability to edit roles', parents: [Permissions.ROOT] },

	[Permissions.MANAGE_BOARD_OWNER]: { title: 'Board Management', subtitle: 'Note: Setting board management permissions on an account/role level will grant them globally i.e for all boards.\nTo make somebody a normal board owner/staff, transfer them the board or give them the appropriate permissions in the board staff permission editing interface.', label: 'Board Owner', desc: 'Full control of the board, equivalent to the BO. Can delete and/or transfer the board. Use with caution!', parents: [Permissions.MANAGE_BOARD_OWNER] },
	[Permissions.MANAGE_BOARD_GENERAL]: { label: 'Board Staff', desc: 'General board staff permission. Access mod index, catalog, recent posts and reports. Ability to submit mod actions. Bypass board-specific bans and post filters.', block: true },
	[Permissions.MANAGE_BOARD_BANS]: { label: 'Bans', desc: 'Access board bans. Ability to unban, edit, or deny appeals.' },
	[Permissions.MANAGE_BOARD_LOGS]: { label: 'Logs', desc: 'Access board logs. Ability to search/filter.' },
	[Permissions.MANAGE_BOARD_SETTINGS]: { label: 'Settings', desc: 'Access board settings. Ability to change any settings. Settings page will show transfer/delete forms for those with "Board Owner" permission.' },
	[Permissions.MANAGE_BOARD_CUSTOMISATION]: { label: 'Customisation', desc: 'Access to board assets and custompages. Ability to upload, create, edit, delete.' },
	[Permissions.MANAGE_BOARD_STAFF]: { label: 'Staff', desc: 'Access to staff management.', parents: [Permissions.MANAGE_BOARD_OWNER] },
	[Permissions.MANAGE_BOARD_TRUSTED]: { label: 'Trusted Users', desc: 'Access to trusted user management.', parents: [Permissions.MANAGE_GLOBAL_GENERAL] },
	[Permissions.VIEW_BOARD_GLOBAL_BANS]: { label: 'View Board Global Bans', desc: 'Ability to view global bans on board modlog pages if the banned post originated from that board.', parents: [Permissions.ROOT] },

	[Permissions.USE_MARKDOWN_GENERAL]: { title: 'Post styling', label: 'Markdown', desc: 'Use markdown' },
	[Permissions.USE_MARKDOWN_IMAGE]: { label: 'Embed Images', desc: 'Embed images', parents: [Permissions.MANAGE_BOARD_OWNER] }, //TODO: add a new permission bit to manage each board inherited perm and use them as additional parents
	
})));

module.exports = {

	Permissions,

	Metadata,

};
