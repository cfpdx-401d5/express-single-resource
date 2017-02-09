const express = require('express');
const Router = express.Router;
const router = Router();

const Modern = require('../models');

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', data => body += data);
        req.on('error', err => reject(err));
        req.on('end', () => {
            const modern = JSON.parse(body);
            resolve(modern);
        });
    });
}

router  
    .get('/', (req, res, next) => {
    const query = {};
    if(req.query.type) {
        query.type = req.query.type
    };
    Modern.find(query)
        .then(modern => res.send(modern))
        .catch(next);
    })

    .get('/:id', (req, res) => {
        Modern.findById(req.params.id)
            .then(modern => {
                if(!modern) {
                    res.status(404).send({ error: `Id ${req.params.id} Not Found`})
                }
                else {
                    res.send(modern);
                }
            })
    })

    .post('/', (req, res, next) => {
        req.mouthBreathing = 'fully loaded';
        next();
    }, (req, res, next) => {
        parseBody(req)
            .then(body => {
                body.mouthBreathing = req.mouthBreathing;
                return new Modern(body).save();
            })
            .then(modern => res.send(modern))
            .catch(next);
    })

    .put('/:id', (req, res) => {
        parseBody(req)
            .then(modern => {
                return Modern.findByIdAndUpdate(
                    req.params.id,
                    modern,
                    { new: true, runValidators: true }
                );
            })
            .then(modern => {
                res.send(modern);
            });
    })

    .delete('/:id', (req, res) => {
        Modern.findByIdAndRemove(req.params.id)
            .then(deleted => {
                res.send({ deleted: !!deleted });
            });
    });

    module.exports = router;