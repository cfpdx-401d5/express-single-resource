const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['m', 'f', 'vampire']
    },
    favoriteToys: [String],
    legs: {
        type: Number,
        validate: {
            validator(value) {
                return value > 0 && value < 7;
            },
            message: '{VALUE} is the __wrong__ number of legs for a unicorn!'
        }
    }
});

const Unicorn = mongoose.model('Unicorn', schema);
module.exports = Unicorn;