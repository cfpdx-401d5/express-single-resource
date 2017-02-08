const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;

const connection = require('./connection');

const path = require('path');
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.get('/modern', (req, res) => {
    connection.db.collection('modern')
        .find().toArray()
        .then(modern => res.send(modern));
});

app.get('/modern/:id', (req, res) => {
    connection.db.collection('modern')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then(modern => {
            if(!modern) {
                res.status(404).send({ error: `Id ${req.params.id} Not Found`});
            }
            else {
                res.send(modern);
            }
        });
});

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', dat => body += data);
        req.on('error', err => reject(err));
        req.on('end', () => {
            const modern = JSON.parse(body);
            resolve(modern);
        });
    });
}

app.post('/modern', (req, res) => {
    parseBody(req).then(modern => {
        connection.db.collection('modern')
            .insert(modern)
            .then(response => response.ops[0])
            .then(savedModern => res.send(savedModern));
    });
});

app.put('/modern/:id', (req, res) => {
    parseBody(req)
        .then(modern => {
            modern._id = new ObjectId(modern._id);
            return connection.db.collection('modern')
                .findOneAndUpdate(
                    { _id: modern._id },
                    modern,
                    { returnOriginal: false }
                );
        })
        .then(updated => res.send(updated.value));
});

app.delete('/modern/:id', (req, res) => {
    connection.db.collection('modern')
        .findOneAndDelete({ _id: new ObjectId(req.params.id)})
        .then(response => {
            res.send({ deleted: response.lastErrorObject.n === 1});
        });
});

module.exports = app;