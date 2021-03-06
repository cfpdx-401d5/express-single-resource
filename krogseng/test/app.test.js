const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tools-test';
require('../lib/connection');
const mongoose = require('mongoose');

const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../lib/app');


describe('tools REST HTTP API', () => {

    let db = null;

    before(() => mongoose.connection.dropDatabase());
    after(() => mongoose.connection.close());

    const request = chai.request(app);

    it('GET returns empty array of tools', () => {
        return request.get('/tools')
            .then(req => req.body)
            .then(tools => assert.deepEqual(tools, []));
    });

    // test data 
    let mongo = {
        "name": "mongo",
        "type": "database"
    };

    let node = {
        "name": "node",
        "type": "platform"
    };

    let superagent = {
        "name": "superagent",
        "type": "client emulator"
    };

    let jquery = {
        "name": "jquery",
        "type": "Javascript library"
    };

    let mocha = {
        "name": "mocha",
        "type": "test framework"
    };


    // just for test, save tools to db
    function saveTool(tool) {
        return request.post('/tools')
            .send(tool)
            .then(res => res.body);
    }

    it('get all for empty array', () => {
        return request.get(`/tools`)
            .then(res => {
                assert.deepEqual(res.body, []);
            });
    });

    it('saving single tool', () => {
        return saveTool(mongo)
            .then(savedTool => {
                assert.isOk(savedTool._id);
                mongo._id = savedTool._id;
                assert.deepEqual(savedTool._id, mongo._id);
            });
    });

    it('GET saved item /tools/:id', () => {
        return request.get(`/tools/${mongo._id}`)
            .then(res => {
                assert.deepEqual(res.body._id, mongo._id);
            });
    });


    it('Save multiple items', () => {
        return Promise.all([
                saveTool(superagent),
                saveTool(mocha)
            ])
            .then(savedTools => {
                superagent = savedTools[0];
                mocha = savedTools[1];
            })
            .then(() => request.get('/tools'))
            .then(res => {
                const tools = res.body;
                assert.deepEqual(tools.length, 3)
            });
    });

    it('GET non-existent item /tools/:id', () => {

        return request.get(`/tools/012345678901`)
            .then(
                () => { throw new Error('success not expected with this id'); },
                res => {
                    assert.equal(res.status, 404)
                    assert.isOk(res.response.body.error);
                }
            );
    });

    it('DELETE /tools/:id', () => {
        return request.del(`/tools/${superagent._id}`)
            .then(res => {
                assert.isTrue(res.body.deleted);
            });
    });

    it('PUT /tools/:id', () => {
        mocha.type = 'flavor';
        const url = (`/tools/${mocha._id}`);

        return request.put(url)
            .send(mocha)
            .then(res => {
                assert.deepEqual(res.body, mocha);
                return request.get(url);
            })
            .then(res => {
                assert.deepEqual(res.body.type, mocha.type);
            });
    });
}); // end describe tools test