'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var cors = require('cors');
var bodyParser=require("body-parser");

var app = express();
require('dotenv').load();


app.use(cors({origin: true, credentials: true}));
app.options('*', cors())

require('./app/config/passportGit')(passport);
require('./app/config/passportLocal')(passport);
require('./app/config/passportFb')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.set("view engine", "jade");
app.set('views', "public");

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.set({'Content-Type': 'charset=UTF-8'})
app.use(bodyParser.json());

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});