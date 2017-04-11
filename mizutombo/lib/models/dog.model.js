const mongoose = require('mongoose');
// ref to Schema "class" ... constructor function
const Schema = mongoose.Schema;

// create new Schema to describe data model for dog
const schema = new Schema({
	name: {
		type: String,
		required: true
	},
	breed: {
		type: String,
		required: true
	}
});

// apply data schema into model "Dog"
const Dog = mongoose.model('Dog', schema);
module.exports = Dog;