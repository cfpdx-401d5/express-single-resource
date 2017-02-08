const chai = require('chai');
const chaiHttp = require('chai-http');
const connection = require('../lib/connection');
const app = require('../lib/app');
const assert = chai.assert;
chai.use(chaiHttp);

describe('shoes REST HTTP API', () => {
    
    const DB_URI = 'mongodb://localhost:27017/shoes-test';
    const request = chai.request(app);

    before(() => connection.connect(DB_URI));
    before(() => connection.db.dropDatabase());
    after(() => connection.closeCurrentDb());

    it('GET returns an empty array of shoes', () => {
        return request.get('/shoes')
        .then(req => req.body)
        .then(shoes => assert.deepEqual(shoes, []));
    });
});