const connection = require('../lib/connection');
const assert = require('chai').assert;

describe('connect to db', () => {

	const DB_URI = 'mongodb://localhost:27017/local';
	let db = null;

	before(() => {
		return connection.connect(DB_URI)
			.then(_db => db = _db);
	});

	it('resolved db from .connect() same as connection.db', () => {
		assert.strictEqual(db, connection.db);
	});

	it('errors on second connect call', () => {
		return connection.connect('mongodb://localhost:27017/crankcall')
			.then(
				() => { throw new Error('should not resolve'); },
				() => true
			);
	});

	it('clears connection.db on close', () => {
		return connection.close()
			.then(() => assert.isNull(connection.db));
	});
});