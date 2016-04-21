// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var ProjectSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, default: ""},
	deadline: {type: Date, default: ""},
	visible: {type: Boolean, default: true},
	skills: {type: [String], default: []},
	categories: {type: [String], required: true},
	tags: {type: [String], default: []},
	creator: {type: String, required: true},
	pendingMembers: {type: [String], default: []},
	approvedMembers: {type: [String], default: []},
	dateCreated: {type: Date, default: Date.now},
	imageURL: {type: String, default: "./data/images/profile.jpg"}
});

// Export the Mongoose model
module.exports = mongoose.model('Project', ProjectSchema);