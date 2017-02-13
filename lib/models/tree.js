const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema ({

    name: {
        type: String,
        required: true
    },
    genus: {
        type: String,
        enum: ['Quercus', 'Acer', 'Pinus', 'Catalpa', 'Ulmus'],
        required: true
    },
    species: {
        type: String
    },
    height: {
        type: Number,
        min: 20,
        max: 80
    }
});

const Tree = mongoose.model('Tree', schema);
module.exports = Tree;