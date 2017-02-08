const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const connection = require('../lib/connection');

const app = require('../lib/app');

describe('schnoodles REST HTTP API', () => {
    const DB_URI = 'mongodb://localhost:27017/schnoodles-test';

    before(() => connection.connect(DB_URI));
    before(() => connection.db.dropDatabase());
    after(() => connection.close());

    const request = chai.request(app);

    it('returns empty array of schnoodles before testing with actual content', () => {
        return request.get('/schnoodles')
            .then(request => request.body)
            .then(schnoodles => assert.deepEqual(schnoodles, []));
    })

})