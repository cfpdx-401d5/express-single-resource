// const chai = require('chai');
// const assert = chai.assert;
// const chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// const connection = require('../lib/connection');

// const app = require('../lib/app');

// describe('pets REST HTTP API', () => {

// 	const DB_URI = 'mongodb://localhost:27017/dogs-test';

// 	before(() => connection.connect(DB_URI));
// 	before(() => connection.db.dropDatabase());
// 	after(() => connection.close());

// 	const request = chai.request(app);

// 	it('GET returns empty array of dogs', () => {
// 		return request.get('/dogs')
// 			.then(req => req.body)
// 			.then(dogs => assert.deepEqual(dogs, []));
// 	});

// 	const cujo = {
// 		name: 'cujo',
// 		breed: 'mastiff'
// 	};

// 	let bo = {
// 		name: 'bo',
// 		breed: 'cattle dog'
// 	};

// 	let zen = {
// 		name: 'zen',
// 		breed: 'crazy dog'
// 	};

// 	function saveDog(dog) {
// 		return request.post('/dogs')
// 			.send(dog)
// 			.then(res => res.body);
// 	}

// 	it('saves a dog', () => {
// 		return saveDog(cujo)
// 			.then(savedDog => {
// 				assert.isOk(savedDog._id);
// 				cujo._id = savedDog._id;
// 				assert.deepEqual(savedDog, cujo);
// 			});
// 	});

// 	it('get saved dog', () => {
// 		return request.get(`/dogs/${cujo._id}`)
// 			.then(res => {
// 				assert.deepEqual(res.body, cujo);
// 			});
// 	});

// 	it('returns list of dogs', () => {
// 		return Promise.all([
// 			saveDog(bo),
// 			saveDog(zen)
// 		])
// 		.then(savedDogs => {
// 			bo = savedDogs[0];
// 			zen = savedDogs[1];
// 		})
// 		.then(() => request.get('/dogs'))
// 		.then(res => {
// 			const dogs = res.body;
// 			assert.deepEqual(dogs, [cujo, bo, zen]);
// 		});
// 	});

// 	it('deletes a dog', () => {
// 		return request.del(`/dogs/${zen._id}`)
// 			.then(res => {
// 				assert.isTrue(res.body.deleted);
// 			});
// 	});

// 	it('delete return false if doesn\'t exist', () => {
// 		return request.del(`/dogs/${zen._id}`)
// 			.then(res => {
// 				assert.isFalse(res.body.deleted);
// 			});
// 	});

// 	it('removes from list get', () => {
// 		return request.get('/dogs')
// 			.then(req => req.body)
// 			.then(dogs => assert.deepEqual(dogs, [cujo, bo]));
// 	});

// 	it('return 404 on non-existing id get', () => {
// 		return request.get('/dogs/589a503f2fe3c376dc88b895')
// 			.then(
// 				() => { throw new Error('successful status code not expected'); },
// 				res => {
// 					assert.equal(res.status, 404);
// 					assert.ok(res.response.body.error);
// 				}
// 			);
// 	});

// 	it('updates with new data', () => {
// 		bo.breed = 'saluki';
// 		const url = `/dogs/${bo._id}`;

// 		return request.put(url)
// 			.send(bo)
// 			.then(res => {
// 				assert.deepEqual(res.body, bo);
// 				return request.get(url);
// 			})
// 			.then(res => {
// 				assert.deepEqual(res.body, bo);
// 			});
// 	});

// });