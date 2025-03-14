'use strict';

const { Accounts, Boards } = require(__dirname+'/../../db/');

module.exports = async (req, res) => {
	const { __ } = res.locals;
	
	const posts = res.locals.posts;
	const accounts = new Set();
	
	for (let i = 0, len = posts.length; i < len; i++) {
		const post = posts[i];
		if (post.account) {
			accounts.add(post.account);
		}
	}
	
	if (accounts.size > 0) {
		const accountsArray = [...accounts];
		await Promise.all([
			Accounts.removeAllTrustedBoard(accountsArray),
			Boards.removeTrustedFromAll(accountsArray),
		]);
	}
	
	return {
		message: __('Untrusted users'),
	};
};
