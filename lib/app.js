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

// app.post(dbPath, (req, res) => {
//     connection.db.collection(dbName)
//         .find( { _id: new ObjectId(req.params.id)})
//         .then(result => res.send(result));
// });

module.exports = app;