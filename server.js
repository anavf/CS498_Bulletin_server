// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var Project = require('./models/project.js');
var Skill = require('./models/skill.js');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
mongoose.connect('mongodb://racrook2:cs498@ds023570.mlab.com:23570/cs498_bulletin');

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
	next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
	extended: true
}));

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
	res.json({ message: 'Hello World!' });
});

// User route
var userRoute = router.route('/users');

// Project route
var projectRoute = router.route('/projects');

// Skill route
var skillRoute = router.route('/skills');

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
