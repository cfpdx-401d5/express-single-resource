// connect us
//const connection = require('../server');
const MongoClient = require('mongodb').MongoClient;
module.exports = {
    db: null,
    connect(dbUri) {
        if (this.db) return Promise.reject('Already connected');
        return MongoClient.connect(dbUri)
            .then(db => this.db = db);
    },
    close() {
        if (!this.db) return Promise.resolve();
        return this.db.close()
            .then(result => {
                this.db = null;
                return result;
            });
    }
};