const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Shoe description schema
const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    colorways: [String],
    releaseYear: {
        type: Number,
        validate: {
            validator(value) {
                return value > 1950
            },
            message: 'This database handles shoes released after 1950'
        }
    }
});

const Shoe = mongoose.model('Shoe', schema);
module.exports = Shoe;