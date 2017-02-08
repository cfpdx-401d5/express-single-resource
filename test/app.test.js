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

    let insideJob = {
        conspiracy: '9-11 Was An Inside Job',
        whoDunnit: 'Shrub and Co.',
        why: 'money and continuous warfare',
        warCrimes: true
    };

    function saveModernConspiracy(modern) {
        return request.post('/modern')
            .send(modern)
            .then(res => res.body);
    }

    it('saves a modern conspiracy', () => {
        return saveModernConspiracy(insideJob)
            .then(savedModern => {
                assert.isOk(savedModern._id);
                insideJob._id = savedModern._id;
                assert.deepEqual(savedModern, insideJob);
            });
    });

    it('get a saved modern conspiracy', () => {
        return request.get(`/modern/${insideJob._id}`)
            .then(res => {
                console.log(res.body);
                assert.deepEqual(res.body, insideJob);
            });
    });
})