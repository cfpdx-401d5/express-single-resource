const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const connection = require('../lib/connection');

const app = require('../lib/app');

describe('pets REST HTTP API', () => {

    const DB_URI = 'mongodb://localhost:27017/pets-test';

    before(() => connection.connect(DB_URI));
    before(() => connection.db.dropDatabase());
    after(() => connection.close());

    const request = chai.request(app);

    it('GET returns empty array of pets', () => {
        return request.get('/pets')
            .then(req => req.body)
            .then(pets => assert.deepEqual(pets, []));
    });

    const garfield = {
        name: 'garfield',
        type: 'cat'
    };

    let tweety = {
        name: 'tweety',
        type: 'bird'
    };

    let geico = {
        name: 'geico',
        type: 'lizard'
    };

    function savePet(pet) {
        return request.post('/pets')
            .send(pet)
            .then(res => res.body);
    }

    it('saves a pet', () => {
        return savePet(garfield)
            .then(savedPet => {
                assert.isOk(savedPet._id);
                garfield._id = savedPet._id;
                assert.deepEqual(savedPet, garfield);
            });
    });

    it('get saved pet', () => {
        return request.get(`/pets/${garfield._id}`)
            .then(res => {
                assert.deepEqual(res.body, garfield);
            });
    });

    it('returns list of pets', () => {
        return Promise.all([
                savePet(tweety),
                savePet(geico)
            ])
            .then(savedPets => {
                tweety = savedPets[0];
                geico = savedPets[1];
            })
            .then(() => request.get('/pets'))
            .then(res => {
                const pets = res.body;
                assert.deepEqual(pets, [garfield, tweety, geico]);
            });
    });

    it('deletes a pet', () => {
        return request.del(`/pets/${geico._id}`)
            .then(res => {
                assert.isTrue(res.body.deleted);
            });
    });

    it('delete return false if doesn\'t exist', () => {
        return request.del(`/pets/${geico._id}`)
            .then(res => {
                assert.isFalse(res.body.deleted);
            });
    });

    it('removes from list get', () => {
        return request.get('/pets')
            .then(req => req.body)
            .then(pets => assert.deepEqual(pets, [garfield, tweety]));
    });

    it('return 404 on non-existing id get', () => {
        return request.get('/pets/589a503f2fe3c376dc88b895')
            .then(
                () => { throw new Error('successful status code not expected'); },
                res => {
                    assert.equal(res.status, 404);
                    assert.ok(res.response.body.error);
                }
            );
    });

    it('updates with new data', () => {
        tweety.type = 'dinosaur';
        const url = `/pets/${tweety._id}`;

        return request.put(url)
            .send(tweety)
            .then(res => {
                assert.deepEqual(res.body, tweety);
                return request.get(url);
            })
            .then(res => {
                assert.deepEqual(res.body, tweety);
            });
    });



});
/////////////
/// test connection to db?
const connection = require('../lib/connection');
const assert = require('chai').assert;

describe.skip('connect to db', () => {

    const DB_URI = 'mongodb://localhost:27017/local';
    let db = null;

    // instead of "done", you can return a promise to mocha test method
    // before(done => {
    //     connection.connect(DB_URI, (err, db) => {
    //         if(err) done(err);
    //         else {
    //             assert.isOk(db);
    //             done();
    //         }
    //     });
    // });

    before(() => {
        return connection.connect(DB_URI)
            .then(_db => db = _db);
    });

    it('resolved db from .connect() same as connection.db', () => {
        assert.strictEqual(db, connection.db);
    });

    it('errors on second connect call', () => {
        return connection.connect('mongodb://localhost:27017/whatever')
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