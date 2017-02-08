const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;
const path = require('path');
const connection = require('./mongo-connection');
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', data => body += data);
        req.on('error', err => reject(err));
        req.on('end', () => {
            const unicorn = JSON.parse(body);
            resolve(unicorn);
        });
    });
}

app.get('/unicorns', (req, res) => {
    connection.db.collection('unicorns')
        .find().toArray()
        .then(unicorns => res.send(unicorns));
});

app.get('/unicorns/:id', (req, res) => {
    connection.db.collection('unicorns')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then(unicorn => {
            if (!unicorn) {
                res.status(404).send({ error: `Id ${req.params.id} Not Found` });
            } else {
                res.send(unicorn);
            }
        });
});

app.post('/unicorns', (req, res) => {
    parseBody(req).then(unicorn => {
        connection.db.collection('unicorns')
            .insert(unicorn)
            .then(response => response.ops[0])
            .then(savedUnicorn => res.send(savedUnicorn));
    });
});

app.put('/unicorns/:id', (req, res) => {
    parseBody(req)
        .then(unicorn => {
            unicorn._id = new ObjectId(unicorn._id);
            return connection.db.collection('unicorns')
                .findOneAndUpdate({ _id: new ObjectId(req.params.id) },
                    unicorn, { returnOriginal: false }
                );
        })
        .then(updated => res.send(updated.value));
});

app.delete('/unicorns/:id', (req, res) => {
    connection.db.collection('unicorns')
        .findOneAndDelete({ _id: new ObjectId(req.params.id) })
        .then(response => {
            res.send({ deleted: response.lastErrorObject.n === 1 });
        });
});

module.exports = app;