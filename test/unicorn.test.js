const assert = require('chai').assert;
const Unicorn = require('../lib/models/unicorn');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

describe('Unicorn model', () => {
    it('example with all fields', () => {
        return new Unicorn({ name: 'Oscar', weight: 125, gender: 'f', legs: 4 })
            .validate()
            .then(pet => console.log(pet))
            .catch(err => { throw err; });
    });

    it('requires name (validation fails when no name)', () => {
        const unicorn = new Unicorn({ weight: 200 });
        return unicorn.validate()
            .then(
                () => { throw new Error('validation should not pass'); },
                err => assert.isNotNull(err)
            );
    });

    it('gender of "m", "f", and "vampire" are accepted', () => {
        const good = ['m', 'f', 'vampire']
            .map(gender => new Unicorn({ name: 'name', weight: 0, gender }).validate());

        return Promise.all(good);
    });

    it('validation error if non-accepted gender', () => {
        return new Unicorn({ name: 'name', gender: 'wolf' })
            .validate()
            .then(
                () => { throw new Error('validation should not pass'); },
                err => assert.isNotNull(err)
            );
    });
});