const app = require('./lib/app');
const connection = require('./lib/connection');
const http = require('http');

const DB_URI = 'mongodb://localhost:27017/schnoodles';

connection.connect(DB_URI)
    .catch(err => {
        console.log('db connection failed: ', err);
    });

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('server running on', server.address());
});