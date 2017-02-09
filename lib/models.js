const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    conspiracy: {
        type: String,
        required: true
    },
    warCrimes: {
        type: Boolean,
        required: true
    },
    whoDunnit: {
        type: String,
        required: false
    },
    why: {
        type: String,
        required: false
    },
    where: {
        type: String,
        required: false
    },
    with: {
        type: String,
        required: false
    },
    whereOnMoon: {
        type: String,
        required: false
    },
    really: {
        type: String,
        required: false
    },
    noButLikeForReal: {
        type: String,
        required: false
    },
    deadRockLegendsReunionTour: {
        type: Boolean,
        required: false
    }
});

const Modern = mongoose.model('Modern', schema);
module.exports = Modern;