const app = require('./lib/app');
require('./lib/connection');
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
	console.log('server running on port ', server.address().port);
});