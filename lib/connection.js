const MongoClient = require('mongodb').MongoClient;

module.exports = {
	db: null,
	connect(dbUri) {
		if (this.db) return Promise.reject('already connected to db');
		return MongoClient.connect(dbUri)
			.then(db => this.db = db);
	},
	close() {
		if(!this.db) return Promise.resolve();
		return this.db.close()
			.then(result => {
				this.db = null;
				return result;
			});
	}
};