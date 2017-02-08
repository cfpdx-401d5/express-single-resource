const assert = require('chai').assert;
const connection = require('../lib/connection');

// run "gomongo" in terminal before you run this test

describe.skip('Connect to mongodb', () => {
    const DB_URI = 'mongodb://localhost:27017/connect-test';
    let db = null;

    // connect to mongodb before the tests
    before(() => {
        return connection.connect(DB_URI)
            // database from connection.connect is assigned to db
            .then(_db => db = _db);
    });

    it('assigned the return of .connect() to db', () => {
        assert.strictEqual(db, connection.db);
    });

    it('returns an error if trying to connect to a new db while connected', () => {
        return connection.connect('mongodb://localhost:27017/anotherDb')
            .then(
            // if there's already a connection, throw error/reject
            () => { throw new Error('should not resolve'); }//,
            // () => true // <-- this is a catch
            )
            // after reject return true, pass test
            .catch ( () => true);
            /*Question: why is there no assertion? */
    });

    it('resets connection.db to null on close', () => {
        return connection.closeCurrentDb()
            .then(() => assert.isNull(connection.db));
            /* Question: why does that^ work and not thisv? */
            // .then(returnObj => {
            //     console.log('returnobj is..', returnObj);
            //     assert.isNull(returnObj.db)
            // });
    });

});