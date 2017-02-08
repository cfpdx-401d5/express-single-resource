const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId

const connection = require('./connection');

const path = require('path');
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.get('/schnoodles', (request, response) => {
    connection.db.collection('schnoodles')
    .find().toArray()
    .then(schnoodles => response.send(schnoodles));
});

app.get('/schnoodles/:id', (request, response) => {
    connection.db.collection('schnoodles')
    .findOne({ _id: new ObjectId(request.params.id) })
    .then(schnoodle => {
        if(!schnoodle) {
            response.statusCode = 404;
            reponse.send({ error: `Id ${req.params.id} Not Found` });
        }
        else {
            response.send(schnoodle);
        }
    });
});

function parseBody(request) {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', data => body += data);
        request.on('error', err => reject(err));
        request.on('end', () => {
            const schnoodle = JSON.parse(body);
            resolve(schnoodle);
        });
    });
}

app.post('/schnoodles', (request, response) => {
    parseBody(request).then(schnoodle => {
        connection.db.collection('schnoodles')
            .insert(schnoodle)
            .then(response => response.ops[0])
            .then(savedSchnoodle => response.send(savedSchnoodle))
    });
});

app.put('/schnoodles/:id', (request, response) => {
    parseBody(request)
        .then(schnoodle => {
            schnoodle._id = new ObjectId(schnoodle._id);
            return connection.db.collection('schnoodles')
                .fineOneAndUpdate(
                    { _id: schnoodle._id },
                    schnoodle,
                    { returnOriginal: false }
                );
        })
        .then(updated => response.send(updated.value));
});

app.delete('/schnoodles/:id', (request, response) => {
    connection.db.collection('schnoodles')
    .fineOneAndDelete({ _id: new ObjectId(req.params.id) })
    .then(response => {
        response.send({ deleted: response.lastErrorObject.n === 1});
    });
});

module.exports = app;
