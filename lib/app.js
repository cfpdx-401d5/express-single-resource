const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;


const connection = require('./connection');

const path = require('path');
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.get('/schnoodles', (req, res) => {
    connection.db.collection('schnoodles')
    .find().toArray()
    .then(schnoodles => res.send(schnoodles));
});

app.get('/schnoodles/:id', (req, res) => {
    connection.db.collection('schnoodles')
    .findOne({ _id: new ObjectId(req.params.id) })
    .then(schnoodles => {
        if(!schnoodles) {
            res.status(404).send({ error: `Id ${req.params.id} Not Found` });
        }
        else {
            res.send(schnoodles);
        }
    });
});

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', data => body += data);
        req.on('error', err => reject(err));
        req.on('end', () => {
            const schnoodles = JSON.parse(body);
            resolve(schnoodles);
        });
    });
}

app.post('/schnoodles', (req, res) => {
    parseBody(req).then(schnoodles => {
        connection.db.collection('schnoodles')
            .insert(schnoodles)
            .then(response => response.ops[0])
            .then(savedSchnoodle => res.send(savedSchnoodle));
    });
});

app.put('/schnoodles/:id', (req, res) => {
    parseBody(req)
        .then(schnoodles => {
            schnoodles._id = new ObjectId(schnoodles._id);
            return connection.db.collection('schnoodles')
                .fineOneAndUpdate(
                    { _id: schnoodles._id },
                    schnoodles,
                    { returnOriginal: false }
                );
        })
        .then(updated => res.send(updated.value));
});

app.delete('/schnoodles/:id', (req, res) => {
    connection.db.collection('schnoodles')
        .findOneAndDelete({ _id: new ObjectId(req.params.id) })
        .then(response => {
            res.send({ deleted: response.lastErrorObject.n === 1 });
        });

});

module.exports = app;
