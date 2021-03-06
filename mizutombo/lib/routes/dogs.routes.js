const express = require('express');
const Router = express.Router;
const router = Router();

const Dog = require('../models/dog.model');

function parseBody(req) {
	return new Promise((resolve, reject) => {
		let body = '';
		req.on('data', data => {
			body += data;
		});
		req.on('error', err => {
			reject(err);
		});
		req.on('end', () => {
			const dog = JSON.parse(body);
			resolve(dog);
		});
	});
}

router
	.get('/', (req, res, next) => {
		const query = {};
		if (req.query.type) {
			query.type = req.query.type;
		}
		Dog.find(query)
			.then(dogs => res.send(dogs))
			.catch(next);
		
	})

	.get('/:id', (req, res, next) => {
		Dog.findById(req.params.id)
			.then(dog => {
				if(!dog) {
					res.status(404).send({ error: `Id ${req.params.id} Not Found` });
				}
				else {
					res.send(dog);
				}
			})
      .catch(next);
	})

	.post('/', (req, res, next) => {
		parseBody(req)
			.then(body => {
				return new Dog(body).save();
			})
			.then(dog => res.send(dog))
			.catch(next);
	})

	.put('/:id', (req, res, next) => {
		parseBody(req)
			.then(dog => {
				return Dog.findByIdAndUpdate(req.params.id,	dog, {new: true, runValidators: true});
			})
			.then(dog => {
				res.send(dog);
			})
      .catch(next);
	})

	.delete('/:id', (req, res, next) => {
		Dog.findByIdAndRemove(req.params.id)
			.then(deleted => {
				res.send({ deleted: !!deleted });
			})
      .catch(next);
	});

module.exports = router;

