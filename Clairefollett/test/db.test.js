const connection = require('../lib/connection');
const assert = require('chai').assert;

describe('connects to database', () => {
    const DB_URI = 'mongodb://localhost:27017/local';
    let db = null;

    before(() => {
        return connection.connect(DB_URI)
            .then(_db => db = _db);
    });

    it('the db that connects is the same as our connection.db', () => {
        assert.strictEqual(db, connection.db);
    });

    it('returns an error on second connect call', () => {
        return connection.connect('mongodb://localhost:27017/local')
          .then (
              () => { throw new Error('should not resolve'); },
              () => true
          );
    });

    it('clears connection.db on close', () => {
        return connection.close()
            .then(() => assert.isNull(connection.db));
    });
});