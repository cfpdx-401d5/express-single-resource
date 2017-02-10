const app = require('./lib/app');
const connection = require('./lib/connection');
const http = require('http');

const DB_URI = 'mongodb://localhost:27017/modern';

connection.connect(DB_URI)
    .catch(err => console.log('Connection to Database Failed:', err));

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Server Running On', server.address());
});