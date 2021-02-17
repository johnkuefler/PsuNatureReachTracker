var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var settingsRouter = require('./routes/settings');
var feedingsRouter = require('./routes/feedings');
var loginRouter = require('./routes/login');
var passport = require('passport');
var flash    = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
const Sentry = require('@sentry/node');
var fs = require('fs');
var path = require('path');

Sentry.init({ dsn: 'https://307cfb0457604717a5837e8db4d1766f@sentry.dev-squared.com/34' });

require('dotenv').config({path: __dirname + '/.env'});

var app = express();
//Sentry request handler
app.use(Sentry.Handlers.requestHandler());
require('./config/passport')(passport); //tells app to use the passport file

mongoose.connect(process.env['DATABASE'],{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({  extended: true,}));
app.use(bodyParser.json());
app.use(cookieParser()); // read cookies (needed for auth)

app.use("/public", express.static(__dirname + "/public"));

//devkey is stored here.. maybe move to the ENV file?
app.use(session({  secret: 'devkey',  resave: true,  saveUninitialized: true,})); // required for passport
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 
app.use(function (req, res, next) {  res.locals.user = req.user;  next();}); //middleware

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/settings', settingsRouter);
app.use('/feedings', feedingsRouter);
app.use('/login', loginRouter);

//Sentry error handler
app.use(Sentry.Handlers.errorHandler());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});


module.exports = app;