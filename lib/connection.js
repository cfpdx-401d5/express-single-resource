const mongoose = require('mongoose');
// use native Promise for mongoose
mongoose.Promise = Promise;

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dogs';

mongoose.connect(dbUri);

// go into Connection Events ...
mongoose.connection.on('connected', function () {
	console.log('Mongoose default connection opens to ' + dbUri);
});

mongoose.connection.on('error', function (err) {
	console.log('Mongoose default connection ERROR: ' + err);
});

mongoose.connection.on('disconnected', function () {
	console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function () {
	mongoose.connection.close(function () {
		console.log('Mongoose default connection disconnected via app termination');
		process.exit(0);
	});
});

module.exports = mongoose.connection;