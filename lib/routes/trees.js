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
};

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
                console.log('body', body);
                return new Tree(body).save();
            })
            .then(tree => res.send(tree))
            .catch(next);
    })

    // .get('/:id', (req, res, next) => {
    //     connection.db.collection('trees')
    //         .findOne({ _id: new ObjectId(req.params.id) })
    //         .then(tree => {
    //             if(!tree) {
    //                 res.status(404);
    //                 res.send({ error: `CANNOT FIND ID: ${req.params.id}`})
    //             } else {
    //                 res.send(tree);
    //             }
    //         });
    // })

    // .put('/trees/:id', (req, res) => {
    //     parseBody(req)
    //         .then(tree => {
    //             tree._id = new ObjectId(tree._id);
    //             return connection.db.collection('trees')
    //                 .findOneAndUpdate(
    //                     { _id: tree._id},
    //                     tree,
    //                     { returnOriginal: false }
    //                 );
    //         })
    //         .then(updated => res.send(updated.value));
    // })

    // .delete('/trees/:id', (req, res) => {
    //     connection.db.collection('trees')
    //         .findOneAndDelete({ _id: new ObjectId(req.params.id) })
    //         .then(response => {
    //                 res.send({ deleted: response.lastErrorObject.n === 1})
    //         }) 
    // });

module.exports = router;