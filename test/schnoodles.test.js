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
    });

    const breezy = {
        name: 'breezy',
        type: 'naughty dog'
    };

    let princess = {
        name: 'princess',
        type: 'naughty dog'
    };

    let moose = {
        name: 'moose',
        type: 'not a schnoodle, my dad\'s cat'
    };

    let caesar = {
        name: 'caesar',
        type: 'not a schnoodle, my childhood chocalte lab'
    };

    let spike = {
        name: 'spike',
        type: 'not a schnoodle, my old cat'
    };

    function saveSchnoodle(schnoodle) {
        return request.post('/schnoodles')
            .send(schnoodle)
            .then(response => response.body);
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
            .then(response => {
                assert.deepEqual(response.body, breezy);
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
        .then(response => {
            const schnoodles = response.body;
            assert.deepEqual(schnoodles, [breezy, princess, moose, caesar, spike]);
        });
    });

    it('deletes a schnoodle', () => {
        return request.del(`/schnoodles/${spike._id}`)
            .then(response => {
                assert.isTrue(response.body.deleted);
            });
    });

    it('delete method returns false if id does not exisst', () => {
        return request.del(`/schnoodles/${spike._id}`)
            .then(response => {
                assert.isFalse(response.body.deleted);
            });
    });

    it('removes from list', () => {
        return request.get('/schnoodles')
            .then(request => request.body)
            .then(schnoodles => assert.deepEqual(schnoodles, [breezy, princess, moose, caesar]));
    });

    it('return 404 if id does not exist', () => {
        return request.get('/schnoodles/hello')
            .then(
                () => { throw new Error('successful status code not expected'); },
                response => {
                    assert.equal(response.status, 500);
                    assert.ok(response.body.error);
                }
            )
    });

    it('updates with new data', () => {

    });

});