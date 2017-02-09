const connection = require('../lib/connection.js');
const assert = require('chai').assert;

describe.skip('connection to db', () => {
    
    const DB_URI = 'mongodb://localhost:27017/local';
    let db = null;

    before(() => {
        return connection.connect(DB_URI)
            .then(_db => db = _db);
    });

    it('db requested and db connected match', () => {
        assert.strictEqual(db, connection.db);
    });

    it('clears connection.db on close', () => {
        return connection.close()
            .then(() => assert.isNull(connection.db));
    });
});