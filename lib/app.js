const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;
const dbName = 'trees';
const dbPath = '/' + dbName;

const connection = require('./connection');

app.get(dbPath, (req, res) => {
    connection.db.collection(dbName)
        .find().toArray()
        .then(result => res.send(result));
});

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', data => body += data);
        req.on('error', err => reject(err));
        req.on('end', () => {
            const tree = JSON.parse(body);
            resolve(tree);
        });
    });
};

app.post('/trees', (req, res) => {
    parseBody(req).then(tree => {
        connection.db.collection('trees')
            .insert(tree)
            .then(response => {
                return response.ops[0]
            })
            .then(savedTree => res.send(savedTree));
    });
});

app.get('/trees/:id', (req, res) => {
    connection.db.collection('trees')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then(tree => {
            if(!tree) {
                res.status(404);
                res.send({ error: `CANNOT FIND ID: ${req.params.id}`})
            } else {
                res.send(tree);
            }
        });
});

module.exports = app;