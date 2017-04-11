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
            .then(req => req.body)
            .then(schnoodles => assert.deepEqual(schnoodles, []));
    });

    let breezy = {
        "name": "breezy",
        "type": "schnoodle"
    };

    let princess = {
        "name": "princess",
        "type": "schnoodle"
    };

    let moose = {
        "name": "moose",
        "type": "schnoodle"
    };

    let caesar = {
        "name": "caesar",
        "type": "schnoodle"
    };

    let spike = {
        "name": "spike",
        "type":"schnoodle",
    };

    function saveSchnoodle(schnoodles) {
        return request.post('/schnoodles')
            .send(schnoodles)
            .then(res => res.body);
    }

    it('saves a schnoodle', () => {
        return saveSchnoodle(breezy)
            .then(savedSchnoodle => {
                assert.isOk(savedSchnoodle._id);
                breezy._id = savedSchnoodle._id;
                assert.deepEqual(savedSchnoodle, breezy);
            });
    });

    it('gets saved schnoodle', () => {
        return request.get(`/schnoodles/${breezy._id}`)
            .then(res => {
                assert.deepEqual(res.body, breezy);
            });
    });

    it('returns a list of schnoodles', () => {
        return Promise.all([
            saveSchnoodle(princess),
            saveSchnoodle(moose),
            saveSchnoodle(caesar),
            saveSchnoodle(spike)
        ])
        .then(savedSchnoodles => {
            princess = savedSchnoodles[0];
            moose = savedSchnoodles[1];
            caesar = savedSchnoodles[2];
            spike = savedSchnoodles[3];
        })
        .then(() => request.get('/schnoodles'))
        .then(res => {
            const schnoodles = res.body;
            assert.deepEqual(schnoodles, [breezy, princess, moose, caesar, spike]);
        });
    });

    it('deletes a schnoodle', () => {
        return request.del(`/schnoodles/${spike._id}`)
            .then(res => {
                assert.isTrue(res.body.deleted);
            });
    });

    it('delete method returns false if id does not exisst', () => {
        return request.del(`/schnoodles/${spike._id}`)
            .then(res => {
                assert.isFalse(res.body.deleted);
            });
    });

    it('removes from list', () => {
        return request.get('/schnoodles')
            .then(req => req.body)
            .then(schnoodles => assert.deepEqual(schnoodles, [breezy, princess, moose, caesar]));
    });

    it('return 404 if id does not exist', () => {
        return request.get('/schnoodles/34324')
            .then(
                () => { throw new Error('error'); },
                res => {
                    assert.equal(res.status, 500);
                }
            );
    });

    it('updates with new data', () => {
        princess.color = 'spotty';
        const url = `/schnoodles/${princess._id}`;

        return request.put(url)
            .send(princess)
            .then(res => {
                assert.deepEqual(res.body, princess);
                return request.get(url);
            })
            .then(res => {
                assert.deepEqual(res.body, princess);
            });
    });

});