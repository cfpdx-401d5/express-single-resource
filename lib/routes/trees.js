const Router = require('express').Router;
const router = Router();

const Tree = require('../models/tree');

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
}

router
    .get('/', (req, res, next) => {
        const query = {};
        if(req.query.type) {
            query.type = req.query.type;
        }
        Tree.find(query)
            .then(trees => res.send(trees))
            .catch(next);
    })

    .post('/', (req, res, next) => {
        parseBody(req)
            .then(body => {
                return new Tree(body).save();
            })
            .then(tree => res.send(tree))
            .catch(next);
    })

    .get('/:id', (req, res) => {    
        Tree.findById(req.params.id)
            .then(tree => {
                if(!tree) {
                    res.status(404).send({ error: `CANNOT FIND ID: ${req.params.id}`});
                } else {
                    res.send(tree);
                }
            });
    })

    .put('/:id', (req, res) => {
        parseBody(req)
            .then(tree => {
                return Tree.findByIdAndUpdate(
                    req.params.id,
                    tree,
                    { new: true, runValidators: true}  
                );
            })
            .then(tree => {
                res.send(tree);
            });
    })

    .delete('/:id', (req, res) => {
        Tree.findByIdAndRemove(req.params.id)
            .then(deletedTree => {
                res.send({ deleted: !!deletedTree});
            });
    });

module.exports = router;