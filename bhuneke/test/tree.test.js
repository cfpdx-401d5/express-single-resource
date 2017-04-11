const assert = require('chai').assert;
const Tree = require('../lib/models/tree');

describe('Tree model', () => {

    it('example includes all fields', () => {
        return new Tree({
            name: 'Japanese Maple',
            genus: 'Acer',
            species: 'palmatum',
            deciduous: true,
            height: 30
        }).validate();
    });

    it('checks for required name', () => {
        return new Tree({
            genus: 'Acer',
            species: 'palmatum',
            deciduous: true,
            height: 30
        })
        .validate()
        .then(
            () => { throw new Error('success not expected');},
            res => {
                assert.isNotNull(res);
            }
        );
    });

    it('checks that provided genus types (Acer, Ulmus, Catalpa, Quercus, Pinus) are accepted', () => {
        const good = ['Ulmus', 'Acer', 'Catalpa', 'Pinus', 'Quercus']
            .map(genus => new Tree({
                name: genus,
                genus
            })
            .validate());
        return Promise.all(good);
    });

    it('checks other genus not accepted', () => {
        return new Tree({
            name: 'name',
            genus: 'bad'
        }).validate()
        .then(
            () => { throw new Error('success not expected');},
            err => {
                assert.isNotNull(err);
            }
        );
    });

    it('fails validation when height out of specified range', () => {
        return new Tree({
            name: 'name',
            genus: 'Acer',
            height: 90
        }).validate()
        .then(
            () => { throw new Error('success not expected');},
            err => {
                assert.isNotNull(err);
            }
        );
    });

    it('passes validation when height within specified range', () => {
        return new Tree({
            name: 'name',
            genus: 'Acer',
            height: 40
        }).validate();
    });

});