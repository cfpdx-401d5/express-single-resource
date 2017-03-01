const Dog = require('../lib/models/dog.model');
const assert = require('chai').assert;
const testInvalid = require('./test-invalid')(Dog);

let testDog = {
	dogName: 'Apollo',
	dogBreed: 'Doberman Pinscher'
};

describe('tests Dog Model : ', () => {

	it('validation fails without dogName value', () => {
		return testInvalid({
			dogBreed: 'Corgi'
		});
	});

	it('validation fails without dogBreed value', () => {
		return testInvalid({
			dogName: 'Zeus'
		});
	});

	it('validation fails when wrong data type is used', () => {
		return testInvalid({
			dogName: 7,
			dogBreed: null
		});
	});

	let testDog = {
		name: 'Reilly',
		breed: 'Irish Wolf Hound'
	};

	it('validation passes wtih all Dog Model values', () => {
		return new Dog(testDog)
      .validate();
	});

});
