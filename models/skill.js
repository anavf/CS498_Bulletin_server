// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var SkillSchema = new mongoose.Schema({
	name: {type: String, required: true, unique: true}
});

// Export the Mongoose model
module.exports = mongoose.model('Skill', SkillSchema);