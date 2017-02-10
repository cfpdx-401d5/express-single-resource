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

    let theLizardKingLives = {
        conspiracy: 'Jim Morrison is Alive and Well!',
        where: 'Deep in the bayou or darkest Africa or...',
        with: 'Elvis and a group of Nazi doppelgangers'
    }

    let moonNazis = {
        conspiracy: 'There are 3 Nazi bases on the moon',
        really: "Yes, really",
        noButLikeForReal: "Sigh, yes for real",
        whereOnMoon: "The dark side, of course"
    }

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

    it('returns a list of modern conspiracies', () => {
        return Promise.all([
            saveModernConspiracy(theLizardKingLives),
            saveModernConspiracy(moonNazis)
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
})