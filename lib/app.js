const express = require('express');
const ObjectId = require('mongodb').ObjectID;
const connection = require('./connection');
const app = express();

// `GET /resources` list ([]) of all the resources
app.get('/shoes', (req, res) => {
    // .collection is a mongo call
    connection.db.collection('shoes')
        .find().toArray()
        .then(shoes => res.send(shoes));
});
// `GET /resources/:id` return single resource object with that id (or 404 if doesn't exist)

// `POST /resources` add a new resource and return new entity from db with _id

// `DELETE /resource/:id` Delete the resource with that id. Return `{ count: <count> }` where count
// is number of deleted records (should be 1 or 0)

// `PUT /resource/:id` The resources is updated or created with the supplied id.

module.exports = app;