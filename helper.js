///main 
const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;

const connection = require('./connection');

const path = require('path');
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.get('/pets', (req, res) => {
    connection.db.collection('pets')
        .find().toArray()
        .then(pets => res.send(pets));
});

app.get('/pets/:id', (req, res) => {
    connection.db.collection('pets')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then(pet => {
            if (!pet) {
                res.status(404).send({ error: `Id ${req.params.id} Not Found` });
            } else {
                res.send(pet);
            }
        });
});

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', data => body += data);
        req.on('error', err => reject(err));
        req.on('end', () => {
            const pet = JSON.parse(body);
            resolve(pet);
        });
    });
}

app.post('/pets', (req, res) => {
    parseBody(req).then(pet => {
        connection.db.collection('pets')
            .insert(pet)
            .then(response => response.ops[0])
            .then(savedPet => res.send(savedPet));
    });
});

app.put('/pets/:id', (req, res) => {
    parseBody(req)
        .then(pet => {
            pet._id = new ObjectId(pet._id);
            return connection.db.collection('pets')
                .findOneAndUpdate({ _id: pet._id },
                    pet, { returnOriginal: false }
                );
        })
        .then(updated => res.send(updated.value));
});

app.delete('/pets/:id', (req, res) => {
    connection.db.collection('pets')
        .findOneAndDelete({ _id: new ObjectId(req.params.id) })
        .then(response => {
            res.send({ deleted: response.lastErrorObject.n === 1 });
        });
});

module.exports = app;
///
////test