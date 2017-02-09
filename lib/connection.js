const mongoose = require('mongoose');
// tell which promise library for mongoose to use (native Promise)
mongoose.Promise = Promise; 

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shoes';

mongoose.connect(dbUri);

// when the connection is successful
mongoose.connection.on('connected', function() {
    console.log(`Mongoose connected to ${dbUri}`);
});

// when the connection throws an error
mongoose.connection.on('error', function(err) {
    console.log(`Mongoose encountered an error on connection: ${err}`);
});

// when the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose has been disconnected');
});

// when the connnection is disconnected from the terminated Node process
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose connection has been disconnected through app termination');
    })
});

module.exports = mongoose.connection;