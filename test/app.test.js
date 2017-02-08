const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const connection = require('../lib/connection');

const app = require('../lib/app');

describe('modern conspiracies REST HTTP API', () => {
    const DB_URI = 'mongodb://localhost:27017/modern-test';

    before(() => connection.connect(DB_URI));
    before(() => connection.db.dropDatabase());
    after(() => connection.close());

    const request = chai.request(app);

    it('GET returns an empty modern array', () => {
        return request.get('/modern')
            .then(req => req.body)
            .then(modern => assert.deepEqual (modern, []));
    });

})