const mongoose = require('mongoose');

mongoose.Promise = Promise;

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/unicorns';

mongoose.connect(dbUri);

//successful connection
mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open to ' + dbUri);
});

//connection with error
mongoose.connection.on('error', err => {
    console.log('Mongoose default connection error: ' + err);
});

//connection closed
mongoose.connection.on('diconnected', () => {
    console.log('Mongoose default connection closed.');
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection closed through app termination.');
        process.exit(0);
    });
});

module.exports = mongoose.connection;