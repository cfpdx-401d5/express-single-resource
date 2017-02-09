const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    conspiracy: {
        type: String,
        required: true
    },
    warCrimes: {
        type: Boolean
    }
});

const Pet = mongoose.model('Modern', schema);
module.exports = Modern;