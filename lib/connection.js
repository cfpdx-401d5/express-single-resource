// connect us
const mongoose = require('mongoose');
mongoose.Promise = Promise;
//const MongoClient = require('mongodb').MongoClient;

// this goes away to become mongoose connections.
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