const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const connection = require('../lib/connection');
const app = require('../lib/app');

describe('tools REST HTTP API', () => {
    const DB_URI = 'mongodb://localhost:27017/tools-test';
    let db = null;

    before(() => connection.connect(DB_URI));
    before(() => connection.db.dropDatabase());
    after(() => connection.close());

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

    it('saving single tool', () => {
        return saveTool(mongo)
            .then(savedTool => {
                assert.isOk(savedTool._id);
                mongo._id = savedTool._id;
                assert.deepEqual(savedTool, mongo);
            });
    });

    it('GET saved item /tools/:id', () => {
        return request.get(`/tools/${mongo._id}`)
            .then(res => {
                assert.deepEqual(res.body, mongo);
            });
    });

    it('GET non-existent item /tools/:id', () => {
        // use object from testdata that hasn't been added yet
        return request.get(`/tools/012345678901`)
            .then(
                () => { throw new Error('success not expected with this id'); },
                res => {
                    assert.equal(res.status, 404)
                    assert.isOk(res.response.body.error);
                }
            );
    });

}); // end describe tools test