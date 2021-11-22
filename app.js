var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');

const LocalStrategy = require('passport-local').Strategy;
const Student = require('./models/student');
const Staff = require('./models/staff');
const Complaint = require('./models/complaint');
const Passport = require('./config/passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mongoURI = require('./mongoURI');

var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = mongoURI.getMongoURI();
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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


// passport
// app.use(passport.initialize());
// app.use(passport.authenticate('session'));

// passport.serializeUser(Student.serializeUser());
// passport.deserializeUser(Student.deserializeUser());

// passport.use(new LocalStrategy(Student.authenticate()));

module.exports = app;
