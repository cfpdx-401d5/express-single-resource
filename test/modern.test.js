const app = require('../lib/app');

const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/modern-test';
require('../lib/connection');
const mongoose = require('mongoose');

describe('modern REST HTTP API', () => {
    
    before(() => mongoose.connection.dropDatabase());
    const request = chai.request(app);

    it('GET returns empty array of modern conspiracies', () => {
        return request.get('/modern')
        .then(req => req.body)
        .then(modern => assert.deepEqual(modern, []));
    });

    const insideJob = {
        conspiracy: '9-11 Was An Inside Job',
        whoDunnit: 'Shrub and Co.',
        why: 'cash, control and continuous warfare',
        warCrimes: true
    };

    let theLizardKingLives = {
        conspiracy: 'Jim Morrison is Alive and Well!',
        where: 'Deep in the bayou or darkest Africa or...',
        with: 'Elvis and a group of Nazi doppelgangers',
        warCrimes: false
    };

    let moonNazis = {
        conspiracy: 'There are 3 Nazi bases on the moon',
        really: "Yes, really",
        noButLikeForReal: "Sigh, yes for real",
        whereOnMoon: "The dark side, of course",
        warCrimes: true
    };

    function saveModern(modern) {
        return request.post ('/modern')
            .send(modern)
            .then(res => res.body);
    }

    it('saves a modern conspiracy', () => {
        return saveModern(insideJob)
            .then(savedModern => {
                assert.isOk(savedModern._id);
                insideJob._id = savedModern._is;
                //insideJob.__v = 0;
                assert.deepEqual(savedModern, insideJob);
            });
    });

    it('returns list of modern conspiracies', () => {
        return Promise.all([
            saveModern(theLizardKingLives),
            saveModern(moonNazis)
        ])
        .then(savedModern => {
            theLizardKingLives = savedModern[0];
            moonNazis = savedModern[1];
        })
        .then(() => request.get('/modern'))
        .then(res => {
            const modern = res.body;
            assert.deepEqual(modern, [insideJob, theLizardKingLives, moonNazis]);
        });
    });

    it('deletes a modern conspiracy', () => {
        return request.del(`/modern/${moonNazis._id}`)
            .then(res => {
                assert.isTrue(res.body.deleted);
            });
    });

    it('delete returns false if data doesn\'t exist', () => {
        return request.del(`/modern/${moonNazis._id}`)
            .then(res => {
                assert.isFalse(res.body.deleted);
            });
    });

    it('removes from list get', () => {
        return request.get('/modern')
            .then(req => req.bodu)
            .then(modern => assert.deepEqual(modern, [insideJob, theLizardKingLives]));
    });

    it('returns 404 on non-existing id get', () => {
        return request.get('/modern/97218ab723y6')
            .then(
                () => {throw new Error('Status of Success Not Expected');},
                res => {
                    assert.equal(res.status, 404);
                    assert.ok(res.response.body.error);
                }
            );
    });

    it('updates collection members with new data', () => {
        theLizardKingLives.deadRockLegendsReunionTour = false;
        const url = `/modern/${theLizardKingLives._id}`;

        return request.put(url)
            .send(theLizardKingLives)
            .then(res => {
                assert.deepEqual(res.body, theLizardKingLives);
            });
    });
});
