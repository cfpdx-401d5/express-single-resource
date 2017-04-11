const router = require('express').Router();
const Tool = require('../models/tool-schema');
const ObjectId = require('mongodb').ObjectId;

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

router
    .get('/tools', (req, res, next) => {
        Tool.find()
            .then(tools => res.send(tools))
            .catch(next);
    })
    .post('/tools/', (req, res, next) => {
        parseBody(req)
            .then(tool => {
                new Tool(tool)
                    .save()
                    .then(tool => {
                        res.send(tool);
                    });
            })
            .catch(next);
    })
    .get('/tools/:id', (req, res, next) => {
        Tool.findOne({ _id: new ObjectId(req.params.id) })
            .then(tool => {
                if (!tool) {
                    res.status(404).send({ error: `Id ${req.params.id} Not Found` });
                } else {
                    res.send(tool);
                }
            })
            .catch(next);
    })
    .delete('/tools/:id', (req, res, next) => {
        Tool.findByIdAndRemove(req.params.id)
            .then(deleted => {
                res.send({ deleted: !!deleted });
            })
            .catch(next);
    })
    .put('/tools/:id/', (req, res, next) => {
        parseBody(req)
        .then(tool => {
            return Tool.findByIdAndUpdate(req.params.id,
            tool,
            { new: true, runValidators: true }
            );
        })
        .then(tool => {
            res.send(tool);
        })
            .catch(next);
    });

module.exports = router;