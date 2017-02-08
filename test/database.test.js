const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const connection = require('../lib/mongo-connection');

const app = require('../lib/app');

describe('unicorns REST HTTP API', () => {

    const DB_URI = 'mongodb://localhost:27017/unicorns';

    before(() => connection.connect(DB_URI));
    before(() => connection.db.dropDatabase());
    after(() => connection.close());

    const request = chai.request(app);

    it('GET returns empty array of unicorns', () => {
        return request.get('/unicorns')
            .then(req => req.body)
            .then(unicorns => assert.deepEqual(unicorns, []))
            .catch(err => {
                throw err;
            });
    });

    const garfield = {
        name: 'garfield',
        loves: ['lasagna', 'plants'],
        weight: 25,
        gender: 'm'
    };

    let tweety = {
        name: 'tweety',
        loves: ['seeds', 'grandma'],
        weight: 1,
        gender: 'm'
    };

    let geico = {
        name: 'geico',
        loves: ['insurance', 'beaches'],
        weight: 3,
        gender: 'm'
    };

    function saveUnicorn(unicorn) {
        return request.post('/unicorns')
            .send(unicorn)
            .then(res => res.body);
    }

    it('saves a unicorn', () => {
        return saveUnicorn(garfield)
            .then(savedUnicorn => {
                assert.isOk(savedUnicorn._id);
                garfield._id = savedUnicorn._id;
                assert.deepEqual(savedUnicorn, garfield);
            });
    });

    it('get saved unicorn', () => {
        return request.get(`/unicorns/${garfield._id}`)
            .then(res => {
                assert.deepEqual(res.body, garfield);
            });
    });

    it('returns list of unicorns', () => {
        return Promise.all([
                saveUnicorn(tweety),
                saveUnicorn(geico)
            ])
            .then(savedUnicorns => {
                tweety = savedUnicorns[0];
                geico = savedUnicorns[1];
            })
            .then(() => request.get('/unicorns'))
            .then(res => {
                const unicorns = res.body;
                assert.deepEqual(unicorns, [garfield, tweety, geico]);
            });
    });

    it('deletes a unicorn', () => {
        return request.del(`/unicorns/${geico._id}`)
            .then(res => {
                assert.isTrue(res.body.deleted);
            });
    });

    it('delete return false if doesn\'t exist', () => {
        return request.del(`/unicorns/${geico._id}`)
            .then(res => {
                assert.isFalse(res.body.deleted);
            });
    });

    it('removes from list get', () => {
        return request.get('/unicorns')
            .then(req => req.body)
            .then(unicorns => assert.deepEqual(unicorns, [garfield, tweety]));
    });

    it('return 404 on non-existing id get', () => {
        return request.get('/unicorns/589a503f2fe3c376dc88b895')
            .then(
                () => { throw new Error('successful status code not expected'); },
                res => {
                    assert.equal(res.status, 404);
                    assert.ok(res.response.body.error);
                }
            );
    });

    it('updates with new data', () => {
        tweety.loves = 'dinosaur';
        const url = `/unicorns/${tweety._id}`;

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