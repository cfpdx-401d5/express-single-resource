// main brains in app
const express = require('express');
const app = express(); // just always do this
const ObjectId = require('mongodb').ObjectId;
const connection = require('./connection');
const path = require('path');
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.get('/tools', (req, res) => {
    connection.db.collection('tools')
        .find().toArray()
        .then(tools => res.send(tools));
});
module.exports = app;