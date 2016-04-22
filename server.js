// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var Project = require('./models/project.js');
var Skill = require('./models/skill.js');
var Category = require('./models/category.js');
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
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
	res.json({ message: 'Hello World!' });
});

// User route
var userRoute = router.route('/users');

userRoute.get(function(req, res) {
	User.find(eval("(" + req.query.where + ")")).
		sort(eval("(" + req.query.sort + ")")).
		select(eval("(" + req.query.select + ")")).
		skip(req.query.skip).
		limit(req.query.limit).
		exec(function(err, ret) {
			if (err) {
				res.status(404).send({message: "Error", data: []});
			}
			else {
				res.status(200).send({message: "OK", data: ret});
			}
		});
});

userRoute.post(function(req, res) {
	var ret = new User();
	ret.name = req.body.name;
	ret.email = req.body.email;
	ret.password = req.body.password;
	ret.skills = req.body.skills;
	ret.myProjects = req.body.myProjects;
	ret.joinedProjects = req.body.joinedProjects;
	ret.imageURL = req.body.imageURL;
	ret.save(function(err) {
		if (err) {
			res.status(500).send({message: "Error", data: []});
		}
		else {
			res.status(201).send({message: "OK", data: ret});
		}
	});
});

// Project route
var projectRoute = router.route('/projects');

projectRoute.get(function(req, res) {
	Project.find(eval("(" + req.query.where + ")")).
		sort(eval("(" + req.query.sort + ")")).
		select(eval("(" + req.query.select + ")")).
		skip(req.query.skip).
		limit(req.query.limit).
		exec(function(err, ret) {
			if (err) {
				res.status(404).send({message: "Error", data: []});
			}
			else {
				res.status(200).send({message: "OK", data: ret});
			}
		});
});

projectRoute.post(function(req, res) {
	var ret = new Project();
	ret.name = req.body.name;
	ret.description = req.body.description;
	ret.deadline = req.body.deadline;
	ret.visible = req.body.visible;
	ret.skills = req.body.skills;
	ret.categories = req.body.categories;
	ret.tags = req.body.tags;
	ret.creator = req.body.creator;
	ret.pendingMembers = req.body.pendingMembers;
	ret.approvedMembers = req.body.approvedMembers;
	ret.imageURL = req.body.imageURL;
	ret.save(function(err) {
		console.log(err);
		if (err) {
			res.status(500).send({message: "Error", data: ret});
		}
		else {
			res.status(201).send({message: "OK", data: ret});
		}
	});
});

// Skill route
var skillRoute = router.route('/skills');

skillRoute.get(function(req, res) {
	Skill.find(eval("(" + req.query.where + ")")).
		sort(eval("(" + req.query.sort + ")")).
		select(eval("(" + req.query.select + ")")).
		skip(req.query.skip).
		limit(req.query.limit).
		exec(function(err, ret) {
			if (err) {
				res.status(404).send({message: "Error", data: []});
			}
			else {
				res.status(200).send({message: "OK", data: ret});
			}
		});
});

skillRoute.post(function(req, res) {
	var ret = new Skill();
	ret.name = req.body.name;
	ret.save(function(err) {
		if (err) {
			res.status(500).send({message: "Error", data: []});
		}
		else {
			res.status(201).send({message: "OK", data: ret});
		}
	});
});

// Category route
var categoryRoute = router.route('/categories');

categoryRoute.get(function(req, res) {
	Category.find(eval("(" + req.query.where + ")")).
		sort(eval("(" + req.query.sort + ")")).
		select(eval("(" + req.query.select + ")")).
		skip(req.query.skip).
		limit(req.query.limit).
		exec(function(err, ret) {
			if (err) {
				res.status(404).send({message: "Error", data: []});
			}
			else {
				res.status(200).send({message: "OK", data: ret});
			}
		});
});

categoryRoute.post(function(req, res) {
	var ret = new Category();
	ret.name = req.body.name;
	ret.save(function(err) {
		if (err) {
			res.status(500).send({message: "Error", data: []});
		}
		else {
			res.status(201).send({message: "OK", data: ret});
		}
	});
});

// Single user route
var singleUserRoute = router.route('/users/:id');

singleUserRoute.get(function(req, res) {
	User.findById(req.params.id, function(err, ret) {
		if (err) {
			res.status(404).send({message: "Error", data: []});
		}
		else {
			res.status(200).send({message: "OK", data: ret});
		}
	});
});

singleUserRoute.put(function(req, res) {
	User.findById(req.params.id, function(err, ret) {
		if (err) {
			res.status(404).send({message: "Error", data: []});
		}
		else {
			ret.name = req.body.name;
			ret.email = req.body.email;
			ret.password = req.body.password;
			ret.skills = req.body.skills;
			ret.myProjects = req.body.myProjects;
			ret.joinedProjects = req.body.joinedProjects;
			ret.imageURL = req.body.imageURL;
			ret.save(function (err) {
				if (err) {
					res.status(500).send({message: "Error", data: []});
				}
				else {
					res.status(201).send({message: "OK", data: ret});
				}
			});
		}
	});
});

singleUserRoute.delete(function(req, res) {
	User.findById(req.params.id, function(err, ret) {
		ret.remove(function(err) {
			if (err) {
				res.status(404).send({message: "Error", data: []});
			}
			else {
				res.status(200).send({message: "OK", data: ret});
			}
		});
	});
});

// Single project route
var singleProjectRoute = router.route('/projects/:id');

singleProjectRoute.get(function(req, res) {
	Project.findById(req.params.id, function(err, ret) {
		if (err) {
			res.status(404).send({message: "Error", data: []});
		}
		else {
			res.status(200).send({message: "OK", data: ret});
		}
	});
});

singleProjectRoute.put(function(req, res) {
	Project.findById(req.params.id, function(err, ret) {
		if (err) {
			res.status(404).send({message: "Error", data: []});
		}
		else {
			ret.name = req.body.name;
			ret.description = req.body.description;
			ret.deadline = req.body.deadline;
			ret.visible = req.body.visible;
			ret.skills = req.body.skills;
			ret.categories = req.body.categories;
			ret.tags = req.body.tags;
			ret.pendingMembers = req.body.pendingMembers;
			ret.approvedMembers = req.body.approvedMembers;
			ret.imageURL = req.body.imageURL;
			ret.save(function (err) {
				if (err) {
					res.status(500).send({message: "Error", data: []});
				}
				else {
					res.status(201).send({message: "OK", data: ret});
				}
			});
		}
	});
});

singleProjectRoute.delete(function(req, res) {
	Project.findById(req.params.id, function(err, ret) {
		ret.remove(function(err) {
			if (err) {
				res.status(404).send({message: "Error", data: []});
			}
			else {
				res.status(200).send({message: "OK", data: ret});
			}
		});
	});
});

// Single skill route
var singleSkillRoute = router.route('/skills/:id');

singleSkillRoute.get(function(req, res) {
	Skill.findById(req.params.id, function(err, ret) {
		if (err) {
			res.status(404).send({message: "Error", data: []});
		}
		else {
			res.status(200).send({message: "OK", data: ret});
		}
	});
});

singleSkillRoute.delete(function(req, res) {
	Skill.findById(req.params.id, function(err, ret) {
		ret.remove(function(err) {
			if (err) {
				res.status(404).send({message: "Error", data: []});
			}
			else {
				res.status(200).send({message: "OK", data: ret});
			}
		});
	});
});

// Single category route
var singleCategoryRoute = router.route('/categories/:id');

singleCategoryRoute.get(function(req, res) {
	Category.findById(req.params.id, function(err, ret) {
		if (err) {
			res.status(404).send({message: "Error", data: []});
		}
		else {
			res.status(200).send({message: "OK", data: ret});
		}
	});
});

singleCategoryRoute.delete(function(req, res) {
	Category.findById(req.params.id, function(err, ret) {
		ret.remove(function(err) {
			if (err) {
				res.status(404).send({message: "Error", data: []});
			}
			else {
				res.status(200).send({message: "OK", data: ret});
			}
		});
	});
});

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
