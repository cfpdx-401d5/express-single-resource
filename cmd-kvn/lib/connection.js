// .MongoClient is the thing to connect to mongodb to be a client
const MongoClient = require('mongodb').MongoClient;

module.exports = {
    db: null,

    connect(dbUri) {
        if (this.db) return Promise.reject('The database is already connected to mongo');
        // Use MongoClient to connect to the db and assign it to the db in this module
        return MongoClient.connect(dbUri)
            .then(db => this.db = db);
    },

    closeCurrentDb() {
        // If db is still null, promise is resolved
        if (!this.db) return Promise.resolve();
        // Close the db and reset db to null
        return this.db.close() // .close is a property of the db object
            .then(result => {
                this.db = null;
                return result; /* Question: what is result? */
            });
    }

};