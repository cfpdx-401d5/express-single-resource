const express = require('express');
const Router = express.Router;
const router = Router();
const Unicorn = require('../models/unicorn');

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

router
    .get('/', (req, res, next) => {
        const query = {};
        if (req.query.type) query.type = req.query.type;

        Unicorn.find(query)
            .then(unicorns => res.send(unicorns))
            .catch(next);
    })
    .get('/:id', (req, res) => {
        Unicorn.findById(req.params.id)
            .then(unicorn => {
                if (!unicorn) {
                    res.status(404).send({ error: `Id ${req.params.id} Not Found` });
                } else {
                    res.send(unicorn);
                }
            });
    })
    .post('/', (req, res, next) => {
        req.favoriteToys = ['snuggy'];
        next();
    }, (req, res, next) => {
        parseBody(req)
            .then(body => {
                body.favoriteToys = req.favoriteToys;
                return new Unicorn(body).save();
            })
            .then(unicorn => res.send(unicorn))
            .catch(next);
    })
    .put('/:id', (req, res) => {
        parseBody(req)
            .then(unicorn => {
                return Unicorn.findByIdAndUpdate(
                    req.params.id,
                    unicorn, { new: true, runValidators: true }
                );
            })
            .then(unicorn => {
                res.send(unicorn);
            });
    })
    .delete('/:id', (req, res) => {
        Unicorn.findByIdAndRemove(req.params.id)
            .then(deleted => {
                res.send({ deleted: !!deleted });
            });
    });

module.exports = router;