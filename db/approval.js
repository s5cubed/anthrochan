'use strict';

const Mongo = require(__dirname+'/db.js')
	, { Permissions } = require(__dirname+'/../lib/permission/permissions.js')
	, approvalTypes = require(__dirname+'/../lib/approval/approvaltypes.js')
	, db = Mongo.db.collection('approval');

module.exports = {

	db,

	getPending: async (permissions) => {
		const projection = {};
		if (!permissions.get(Permissions.VIEW_RAW_IP)) {
			projection['ip.raw'] = 0;
		}
		const posts = await db.find({'approved': approvalTypes.PENDING}, { projection }).toArray();
		return posts;
	},

	getUserId: async (filehash) => {
		const file = await db.findOne({'_id': filehash});
		return file.user_id;
	},

	getFileMetadataByUserId: async (user_id) => {
		const filter = {
			user_id: user_id
		};

		const files = await db.find(filter);
		return files.toArray();
	},

	getFileMetadata: async (filehash) => {
		const file = await db.findOne({'_id': filehash});
		return file;
	},

	approve: async(filehash) => {
		const filter = {
			_id: filehash
		};

		const update = {
			$set: {
				approved: approvalTypes.APPROVED,
			},
		};

		await db.updateOne(filter, update);
	},

	denyAll: async (user_id) => {
		const filter = {
			user_id: user_id,
			approved: approvalTypes.PENDING,
		};

		const update = {
			$set: {
				approved: approvalTypes.DENIED,
			},
		};

		await db.updateMany(filter, update);
	},

	deny: async(filehash) => {
		const filter = {
			_id: filehash
		};

		const update = {
			$set: {
				approved: approvalTypes.DENIED
			},
		};

		await db.updateOne(filter, update);
	},

	isApproved: async(filehash) => {
		const file = await db.findOne({ _id: filehash});
		return file ? file.approved === approvalTypes.APPROVED : false;
	},

	isDenied: async(filehash) => {
		const file = await db.findOne({ _id: filehash});
		return file ? file.approved === approvalTypes.DENIED : false;
	},

	insertOne: async (data) => {
		const filter = {
			'_id': data.hash,
		};

		const update = {
			'$setOnInsert': data,
		};

		const options = {
			upsert: true,
		};

		await db.updateOne(
			filter,
			update,
			options,
		);
	},

	deleteAll: () => {
		return db.deleteMany({});
	}

};