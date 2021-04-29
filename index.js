// External
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local');

// Internal
const model = require("./model");

// Start app.
const app = express();
const port = process.env.PORT || 8080;

// Apply Middlewears.
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cors({ credentials: true, origin: "https://limitless-hollows-74371.herokuapp.com" }));
// app.use(cors({ credentials: true, origin: null }));
app.use(express.static('public'));
app.use(session({ secret: 'pifwuq984qvsd24fsk', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Set up Passport.

// 1. local strategy implementation.
passport.use(new passportLocal.Strategy({
	usernameField: "email", // these are keys for postman email and plainPassword
	passwordField: "plainPassword"
}, function(email, plainPassword, done) {
	// done is a callback function. Call when done.
	model.User.findOne({ email: email }).then(function (user) {
		// Verify that the user exists.
		if (!user) {
			// fail: user does not exist.
			done(null, false);
			return;
		}

		// verify user's password.
		user.verifyPassword(plainPassword, function (result) {
			if (result) {
				// success
				done(null, user);
			} else {
				// fail: passwords don't match
				done(null, false);
			}
		});
	}).catch(function (err) {
		// fail: error querying database
		done(err);
	});
}));

// 2. serialize user to session.
passport.serializeUser(function (user, done) {
	done(null, user._id);
});

// 3. deserialize user from session.
passport.deserializeUser(function (userId, done) {
	model.User.findOne({ _id: userId }).then(function (user) {
		done(null, user);
	}).catch(function (err) {
		done(err);
	});
});

// 4. authenticate endpoint.
app.post("/session", passport.authenticate("local"), function (req, res) {
	// this function is called if authentication succeeds.
	res.sendStatus(201);
});

// 5. "me" endpoint.
app.get("/session", function (req, res) {
	if (req.user) {
		// Send user details.
		var reply = {
			email: req.user.email,
			scheduleData: req.user.scheduleData,
			classData: req.user.classData,
			weekData: req.user.weekData,
			friendData: req.user.friendData,
			_id: req.user._id
		};
		res.json(reply);
	} else {
		// Send 401.
		res.sendStatus(401);
	}
});

// Logout endpoint.
app.delete('/session', function (req, res) {
	req.logout();
	res.sendStatus(200);
});

// Set up routes.

// Post New User
app.post('/user', (req, res) => {

	var user = new model.User({
		email: req.body.email,
		scheduleData: req.body.scheduleData,
		classData: req.body.classData,
		weekData: req.body.weekData,
		friendData: req.body.friendData
	});

	user.setEncryptedPassword(req.body.plainPassword, function() {
		user.save().then(() => {
			// user created
			res.sendStatus(201);
		}).catch(function (err) {
			if (err.errors) {
				var messages = {};
				for (var e in err.errors) {
					messages[e] = err.errors[e].message;
				}
				res.status(422).json(messages);
			} else if (err.code == 11000) {
				res.status(422).json({
					email: "Already registered."
				});
			} else {
				// Some other error.
				res.sendStatus(500);
			}
		});
	});
});

app.put('/user/:userID', (req, res) => {
	if (req.user) {
		model.User.findOne({ _id: req.params.userID }).then((user) => {
			if (!user._id.equals(req.user._id)) {
				res.sendStatus(401);
			} else {
				if (user) {
					user.scheduleData = req.body.scheduleData;
					user.classData = req.body.classData;
					user.weekData = req.body.weekData;
					user.friendData = req.body.friendData;

					user.save().then(() => {
						// Book updated.
						// res.set("Access-Control-Allow-Origin", "*");
						res.sendStatus(200);
					}).catch(function (err) {
						if (err.errors) {
							var messages = {};
							for (var e in err.errors) {
								messages[e] = err.errors[e].message;
							}
							res.status(422).json(messages);
						} else {
							res.sendStatus(500);
						}
					});
				} else {
					res.sendStatus(404);
				}
			}
		});
	} else {
		res.sendStatus(401);
	}
});

// 404 is automatic.

app.listen(port, () => {
  console.log("The server is running on port", port);
});