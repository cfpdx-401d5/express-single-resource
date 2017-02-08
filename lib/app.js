const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId;

const connection = require('./connection');

const path = require('path');
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.get('/dogs', (req, res) => {
	connection.db.collection('dogs')
		.find().toArray()
		.then(dogs => res.send(dogs));
});

app.get('/dogs/:id', (req, res) => {
	connection.db.collection('dogs')
		.findOne({ _id: new ObjectId(req.params.id) })
		.then(dog => {
			if (!dog) {
				res.status(404).send({ error: `Id ${req.params.id} not found` });
			}
			else {
				res.send(dog);
			}
		});
});

function parseBody(req) {
	return new Promise((resolve, reject) => {
		let body = '';
		req.on('data', data => body += data);
		req.on('error', err => reject(err));
		req.on('end', () => {
			const dog = JSON.parse(body);
			resolve(dog);
		});
	});
}

app.post('/dogs', (req, res) => {
	parseBody(req).then(dog => {
		connection.db.collection('dogs')
			.insert(dog)
			.then(response => response.ops[0])
			.then(savedDog => res.send(savedDog));
	});
});

app.put('/dogs/:id', (req, res) => {
	parseBody(req)
		.then(dog => {
			dog._id = new ObjectId(dog._id);
			return connection.db.collection('dogs')
				.findOneAndUpdate(
					{ _id: dog._id },
					dog,
					{ returnOriginal: false }
				);
		})
		.then(updated => res.send(updated.value));
});

app.delete('/dogs/:id', (req, res) => {
	connection.db.collection('dogs')
		.findOneAndDelete({ _id: new ObjectId(req.params.id) })
		.then(response => {
			res.send({ deleted: response.lastErrorObject.n === 1 });
		});
});

module.exports = app;