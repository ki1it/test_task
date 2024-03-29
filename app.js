var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var session   = require('express-session');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var user = {
    username: 'user',
    validPassword: function(passwd) {
        return passwd === 'password';
    }
};

var getUser = function(username, cb) {
    if (username !== user.username)
        return cb(null, null);
    cb(null, user);
};


passport.serializeUser(function(user, cb) {
    cb(null, user.username);
});

passport.deserializeUser(function(username, cb) {
    cb(null, user);
});

passport.use('local-login', new Strategy({
        usernameField : 'username',
        passwordField : 'password'
    },
    function(email, password, done) {
        getUser(email, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, {message: 'Wrong login.'});
            if (!user.validPassword(password))
                return done(null, false, {message: 'Wrong password.'});
            return done(null, user);
        });
    }));


app.use(session({
    secret: 'secret cat',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get('/login',
    function(req, res){
        res.render('login', {message: req.flash('error')});
    });

app.post('/login', passport.authenticate('local-login', {successRedirect:'/',
    failureRedirect: '/login',
    failureFlash : true}), function(req, res, next) {
    res.redirect('/');
});

var indexRouter = require('./routes/index');
// var loginRouter = require('./routes/login');
// app.use('/login', loginRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports.passport = passport;
module.exports.user = user;
module.exports = app;
