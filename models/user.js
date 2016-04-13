// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema = new mongoose.Schema({
	
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);