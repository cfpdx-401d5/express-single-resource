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

    const englishOak = {
        name: 'English Oak',
        genus: 'Quercus',
        species: 'robur'
    };

    const ponderosaPine = {
        name: 'Ponderosa Pine',
        genus: 'Pinus',
        species: 'ponderosa'
    };

    const bigLeafMaple = {
        name: 'Big Leaf Maple',
        genus: 'Acer',
        species: 'macrophyllum'
    };

    function saveTree(tree) {
        return request.post('/trees')
            .send(tree)
            .then(res => res.body);
    }

    it('saves a tree', () => {
        return saveTree(englishOak)
            .then(savedTree => {
                assert.isOk(savedTree._id);;
                englishOak._id = savedTree._id;;
                assert.deepEqual(savedTree, englishOak);
            });
    });

    it('gets saved tree', () => {
        return request.get(`/trees/${englishOak._id}`)
            .then(res => {
                assert.deepEqual(res.body, englishOak);
            });
    });

    after(() => connection.close())
});