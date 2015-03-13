var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var session = require('express-session');

var cookieParser = require('cookie-parser');

var flash = require('connect-flash');

var passport = require('passport');

var passportConfig = require('./config/passport');

var indexController = require('./controllers/index.js');
var adminController = require('./controllers/admin');

mongoose.connect('mongodb://localhost/express-passport-local')

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
require('./models/seeds/acctsSeed.js');
app.use(session({
  secret: 'keyboard cat'
}))

app.use(cookieParser());
app.use(flash());

app.use(passport.initialize());

app.use(passport.session());



// Our get request for viewing the login page
app.get('/login', adminController.login);

// Post received from submitting the login form
app.post('/login', adminController.processLogin);

// Post received from submitting the signup form
app.post('/signup', adminController.processSignup);

// Any requests to log out can be handled at this url
app.get('/logout', adminController.logout);

// ***** IMPORTANT ***** //
// By including this middleware (defined in our config/passport.js module.exports),
// We can prevent unauthorized access to any route handler defined after this call
// to .use()
app.get('/', indexController.index);
app.get('/createacct', function(req,res){
	res.render('createacct')
})
app.use(passportConfig.isLoggedIn);


// app.use(passportConfig.ensureAuthenticated);

app.get('/home', function(req,res){
	res.render('home', {user: req.user})
})

// app.get('/users/:userid', readController.getByUser);
// // If already following dont have follow button other have follow btn
// app.get('/users/:userid/:otheruserid', readController.getByUser)

app.get('/edit', function(req,res){
	res.render('edit')
})
app.get('/search', function(req, res){
	res.render('search')
})
app.get('/discover', function(req,res){
	res.render('discover')
})
app.get('/favorites', function(req, res){
	res.render('favorites')
})
app.get('/notifications', function(req, res){
	res.render('notifications')
})
app.get('/changeUsername', function(req, res){
	res.render('changeUsername')
})
app.get('/changePassword', function(req, res){
	res.render('changePassword')
})
var server = app.listen(6591, function() {
	console.log('Express server listening on port ' + server.address().port);
});
