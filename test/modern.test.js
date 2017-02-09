const assert = require('chai').assert;
const Modern = require('../lib/models/modern');

describe('Modern model', () => {

    it('requires conspiracy (validation failes when no conspiracy key)', () => {
        const modernConspiracy = new Modern();
        return modernConspiracy.validate()
            .then(
                () => { throw new Error('validation should not pass'); },
                err => { assert.isNotNull(err); }
            );
    });
});