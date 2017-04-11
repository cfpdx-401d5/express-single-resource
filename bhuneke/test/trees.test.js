const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI= 'mongodb://localhost:27017/trees-test';
const connection = require('../lib/connection');
const mongoose = require('mongoose');

const app = require('../lib/app');

describe('trees REST HTTP API', () => {

    before(() => mongoose.connection.dropDatabase());

    const request = chai.request(app);

    it('GET returns empty array of trees', () => {
        return request.get('/trees')
            .then(req => req.body)
            .then(res => assert.deepEqual(res, []));
    });

    let englishOak = {
        name: 'English Oak',
        genus: 'Quercus',
        species: 'robur'
    };

    let ponderosaPine = {
        name: 'Ponderosa Pine',
        genus: 'Pinus',
        species: 'ponderosa'
    };

    let bigLeafMaple = {
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
                assert.isOk(savedTree._id);
                englishOak._id = savedTree._id;
                englishOak.__v = 0;
                assert.deepEqual(savedTree, englishOak);
            });
    });

    it('gets saved tree', () => {
        return request.get(`/trees/${englishOak._id}`)
            .then(res => {
                assert.deepEqual(res.body, englishOak);
            });
    });

    it('gets a list of trees', () => {
        return Promise.all([
            saveTree(ponderosaPine),
            saveTree(bigLeafMaple)
        ])
        .then(savedTrees => {
            ponderosaPine = savedTrees[0];
            bigLeafMaple = savedTrees[1];
        })
        .then(() => request.get('/trees'))
        .then(res => {
            const trees = res.body;
            assert.deepEqual(trees, [englishOak, ponderosaPine, bigLeafMaple]);
        });
    });

    // it('updates saved tree', () => {
    //     englishOak.genus = 'Ulmus';
    //     return request.put(`/trees/${englishOak._id}`)
    //         .send(englishOak)
    //         .then(res => {
    //             assert.deepEqual(res.body, englishOak);
    //             //return request.get(`/trees/${englishOak._id}`);
    //         });
    //         // .then(res => {
    //         //     assert.deepEqual(res.body, englishOak);
    //         // });
    // });

    it('deletes a tree', () => {
        return request.del(`/trees/${ponderosaPine._id}`)
            .then(res => {
                assert.isTrue(res.body.deleted);
            });
    });

    it('returns false if data to delete does not exist', () => {
        return request.delete(`/trees/${ponderosaPine._id}`)
            .then(res => {
                assert.isFalse(res.body.deleted);
            });
    });

    it('return error 404 on non-existing id get', () => {
        return request.get('/trees/589df44aedd27e7cad8f7d0a')
            .then(
                () => { throw new Error('successful status code not expected');},
                res => {
                    assert.equal(res.status, 404);
                    assert.ok(res.response.body.error);
                } //not throwing error 
            );
    });

    after(() => connection.close());
});