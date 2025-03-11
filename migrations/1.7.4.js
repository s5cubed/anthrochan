'use strict';

module.exports = async(db) => {
	console.log('Removing approved collection');
	await db.collection('approved').deleteMany({});

	console.log('Updating existing files');
	await db.collection('posts').updateMany(
		{}, // match all
		{
			$set: {
				'files.$[].approved': true // set approved for every file in files
			},
		}
	);
};