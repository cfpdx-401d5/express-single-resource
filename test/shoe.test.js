const assert = require('chai').assert;
const Shoe = require('../lib/models/shoe');

describe('Shoe model schema', () => {

    it('requires name', () => {
        const shoe = new Shoe({brand: 'reebok'});
        return shoe.validate()
            .then(
                () => {throw new Error('cannot validate without a name property');},
                err => assert.isNotNull(err)
            );
    });


});