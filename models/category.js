// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var CategorySchema = new mongoose.Schema({
	name: {type: String, required: true, unique: true}
});

// Export the Mongoose model
module.exports = mongoose.model('Category', CategorySchema);