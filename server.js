// the server that starts it all
const app = require('./lib/app');
const connection = require('./lib/connection');
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log('server running on ', server.address());
});