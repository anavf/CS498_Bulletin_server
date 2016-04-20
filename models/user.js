// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema = new mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	skills: {type: [String], default: []},
	myProjects: {type: [String], default: []},
	joinedProjects: {type: [String], default: []},
	dateCreated: {type: Date, default: Date.now},
	imageURL: {type: String}
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);