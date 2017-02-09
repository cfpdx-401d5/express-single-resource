const express = require('express');
const Router = express.Router;
const router = Router();

const Shoe = require('../models/shoe');

const RESOURCE = 'shoes';

// `GET /resources` list ([]) of all the resources
router.get('/' + RESOURCE, (req, res) => {
    // .collection is a mongo call
    connection.db.collection(RESOURCE)
        // .find is a mongo collection method
        .find().toArray()
        // result is shoes in test case
        .then(result => res.send(result));
});

// `GET /resources/:id` return single resource object with that id (or 404 if doesn't exist)
router.get('/' + RESOURCE + '/:id', (req, res) => {
    connection.db.collection(RESOURCE)
        .findOne({ _id: new ObjectId(req.params.id) })
        .then(item => {
            if (!item) {
                res.status(404).send({ error: `id ${req.params.id} cannot be found or does not exist.` });
            }
            else res.send(item);
        });
});

// `POST /resources` add a new resource and return new entity from db with _id
router.post('/' + RESOURCE, (req, res) => {
    parseBody(req).then(item => {
        connection.db.collection(RESOURCE)
            .insert(item)
            // the <response> is an object and .ops property is an
            // array with the item object and its properties
            .then(response => response.ops[0])
            .then(savedItem => res.send(savedItem));
    })
});

// `DELETE /resource/:id` Delete the resource with that id. Return `{ count: <count> }` where count
// is number of deleted records (should be 1 or 0)
router.delete('/' + RESOURCE + '/:id', (req, res) => {
    connection.db.collection(RESOURCE)
        .findOneAndDelete({ _id: new ObjectId(req.params.id) })
        .then(response => {
            res.send({ deleted: response.lastErrorObject.n === 1 });
        });
});

// `PUT /resource/:id` The resources is updated or created with the supplied id.
router.put('/' + RESOURCE + '/:id', (req, res) => {
    parseBody(req)
        .then(item => {
            item._id = new ObjectId(item._id);
            return connection.db.collection(RESOURCE)
                .findOneAndUpdate(
                { _id: item._id },
                item,
                { returnOriginal: false }
                );
        })
        .then(updated => res.send(updated.value));
});

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', data => body += data);
        req.on('error', err => reject(err));
        req.on('end', () => {
            const item = JSON.parse(body);
            resolve(item);
        });
    });
}

module.exports = router;