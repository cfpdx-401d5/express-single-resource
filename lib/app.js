const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;
const resource = 'trees';
const resourcePath = '/' + resource;

const connection = require('./connection');

app.get('/trees', (req, res) => {
    connection.db.collection('trees')
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

app.put('/trees/:id', (req, res) => {
    parseBody(req)
        .then(tree => {
            tree._id = new ObjectId(tree._id);
            return connection.db.collection('trees')
                .findOneAndUpdate(
                    { _id: tree._id},
                    tree,
                    { returnOriginal: false }
                );
        })
        .then(updated => res.send(updated.value));
});

app.delete('/trees/:id', (req, res) => {
    connection.db.collection('trees')
        .findOneAndDelete({ _id: new ObjectId(req.params.id) })
        .then(response => {
                res.send({ deleted: response.lastErrorObject.n === 1})
        }) 
});

module.exports = app;