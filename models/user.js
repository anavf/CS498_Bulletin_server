// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Define our beer schema
var UserSchema = new mongoose.Schema({
	local: {
		email: {type: String, required: true, unique: true},
		password: {type: String, required: true},
	},
	name: {type: String, required: true},
	skills: {type: [String], default: []},
	myProjects: {type: [String], default: []},
	pendingProjects: {type: [String], default: []},
	joinedProjects: {type: [String], default: []},
	dateCreated: {type: Date, default: Date.now},
	imageURL: {type: String, default: "./data/images/profile.jpg"}
});

UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);