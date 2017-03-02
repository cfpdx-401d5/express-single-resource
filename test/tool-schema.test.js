const assert = require('chai').assert;
const Tool = require('../lib/models/tool-schema');

describe('tool model test ', function() {
    it('requires name ', () => {
        let tool = new Tool({ type: 'shovel' });
        return tool.validate()
            .then(
                () => {
                    throw new Error('Validation should not pass');
                },
                err => assert.isNotNull(err)
            );
    });

    it('requires tool type ', () => {
        let tool = new Tool({ name: 'scooper' });
        return tool.validate()
            .then(
                () => {
                    throw new Error('Validation should not pass');
                },
                err => assert.isNotNull(err)
            );
    });
    it('uses all fields', () => {
        return new Tool({
            name: 'big brains',
            type: 'software'
        }).validate();
    });
});