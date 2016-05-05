module.exports = function(app, passport) {

	app.post('http://162.243.18.198:4000/api/users', passport.authenticate('local-signup'), function(req, res) {
		res.redirect('/571a8c59893dee580c4fea12/MyProfilePage/571a8c59893dee580c4fea12');
	});

	app.post('/login', passport.authenticate('local-login'), function(req, res) {
		res.redirect('/profile.html');
	});

	app.get('/profile', isLoggedIn, function(req, res) {
		res.json({
			user: req.user
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated())
			return next();

		res.json({
			error: "User not logged in"
		});
	}

};