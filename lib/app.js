// main brains in app
const express = require('express');
const app = express(); // just always do this
const ObjectId = require('mongodb').ObjectId;
const connection = require('./connection');
const path = require('path');
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

// every body must get parsed...
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', data => body += data);
        req.on('error', err => reject(err));
        req.on('end', () => {
            const tool = JSON.parse(body);
            resolve(tool);
        });
    });
};

app.post('/tools/', (req, res) => {
    parseBody(req).then(tool => {
        connection.db.collection('tools')
            .insert(tool)
            .then(response => response.ops[0])
            .then(savedTool => res.send(savedTool));
    });
});

// get every thing
app.get('/tools', (req, res) => {
    connection.db.collection('tools')
        .find().toArray()
        .then(tools => res.send(tools));
});

// get specific
app.get('/tools/:id', (req, res) => {
    connection.db.collection('tools')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then(tool => {
            if (!tool) {
                res.status(404).send({ error: `Id ${req.params.id} Not Found` });
            } else {
                res.send(tool);
            };
        });
});

module.exports = app;