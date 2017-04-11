const chai = require('chai');
const chaiHttp = require('chai-http');
const connection = require('../lib/connection');
const app = require('../lib/app');
const assert = chai.assert;
chai.use(chaiHttp);

describe('shoes REST HTTP API', () => {

    const DB_URI = 'mongodb://localhost:27017/shoes-test';
    const request = chai.request(app);

    // test shoes
    let ajXI = {
        name: 'AJXI',
        brand: 'Jordan'
    };

    let pennyII = {
        name: 'PennyII',
        brand: 'Nike'
    };

    let pureBoost = {
        name: 'PureBoost',
        brand: 'Adidas'
    };

    before(() => connection.connect(DB_URI));
    before(() => connection.db.dropDatabase());
    after(() => connection.closeCurrentDb());

    it('GET returns an empty array of shoes', () => {
        return request.get('/shoes')
            .then(req => req.body)
            .then(shoes => assert.deepEqual(shoes, []));
    });

    it('POSTs a shoe with an id', () => {
        /* this is the refactored version with postShoe()*/
        // return postShoe(ajXI)
        //     .then(savedShoe => {
        //         assert.isOk(savedShoe._id);
        //         ajXI._id = savedShoe._id;
        //         assert.deepEqual(savedShoe, ajXI);
        //     })

        /* this is postShoe() */
        return request.post('/shoes')
            .send(ajXI)
            .then(res => res.body)
            /* this is postShoe() ^^ */
            // <res.body> can't be in place of <saved>
            // because js will interpret it as an obj
            .then(saved => {
                assert.isOk(saved._id);
                ajXI._id = saved._id;
                assert.deepEqual(ajXI._id, saved._id);
            });
    });

    it('GETs a POSTed shoe by its id', () => {
        return request.get(`/shoes/${ajXI._id}`)
            .then(res => {
                assert.deepEqual(res.body, ajXI);
            });
    });

    it('GETs multiple POSTed shoes', () => {
        return Promise.all([
            postShoe(pennyII),
            postShoe(pureBoost)
        ])
            .then(savedShoes => {
                pennyII = savedShoes[0];
                pureBoost = savedShoes[1];
            })
            .then(() => request.get('/shoes'))
            .then(res => {
                const shoes = res.body;
                assert.deepEqual(shoes, [ajXI, pennyII, pureBoost]);
            });
    });

    it('DELETEs a shoe by id', () => {
        return request.del(`/shoes/${ajXI._id}`)
            .then(res => {
                assert.isTrue(res.body.deleted); // is 1
            });
    });

    it('can not DELETE a nonexistant shoe', () => {
        return request.del(`/shoes/${ajXI._id}`)
            .then(res => {
                assert.isFalse(res.body.deleted);
            });
    });

    it('GETs the updated /shoes after a DELETion', () => {
        return request.get('/shoes')
            .then(res => res.body)
            .then(shoes => assert.deepEqual(shoes, [pennyII, pureBoost]));
    });

    it.skip('returns error when !GET/:id', () => {
        // const fakeId = ajXI._id.slice(0, -3) + '8o8';
        // const fakeId = '589c2f5525066f788d0238o8';

        return request.get('/shoes/589c2f5525066f788d0238o8')//(`/shoes/${fakeId}`)
            .then(
            () => { throw new Error('successful status code not expected'); },
            res => {
                assert.equal(res.status, 500);
                // assert.ok(res.response.body.error);
            }
            );
    });

    it('PUTs in new data', () => {
        pennyII.color = 'atlantic blue';
        const url = `/shoes/${pennyII._id}`;

        return request.put(url)
            .send(pennyII)
            .then(res => {
                assert.deepEqual(res.body, pennyII);
                return request.get(url);
            })
            .then(res => {
                assert.deepEqual(res.body, pennyII);
            });
    });

    function postShoe(shoe) {
        return request.post('/shoes')
            .send(shoe)
            .then(res =>
                // console.log('rezbody..', res.body)
                res.body);
    }

});