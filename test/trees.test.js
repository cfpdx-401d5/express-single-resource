const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const connection = require('../lib/connection');
const app = require('../lib/app');

describe('trees REST HTTP API', () => {

    const DB_URI = 'mongodb://localhost:27017/trees-test';

    before(() => connection.connect(DB_URI));
    before(() => connection.db.dropDatabase());

    const request = chai.request(app);

    it('GET returns empty array of trees', () => {
        return request.get('/trees')
            .then(req => req.body)
            .then(res => assert.deepEqual(res, []));
    });

    const oak = {
        commonName: 'Oak',
        botanicalName: 'Quercus'
    };

    const pine = {
        commonName: 'Pine',
        botanicalName: 'Pinus'
    };

    const maple = {
        commonName: 'Maple',
        botanicalName: 'Acer'
    };

    // it('saves a tree', () => {
    //     return request.post('/trees')
    //         .send(oak)
    //         .then(res => res.body)
    //         .then(savedTree => {
    //             assert.deepEqual(savedPet, oak);
    //             assert.isNotNull(savedPet._id)
    //         });
    // });

    after(() => connection.close())
});