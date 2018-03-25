var http = require('http');
var express = require('express');
/*var proxy = require('http-proxy');*/
var path = require('path');
var jwt = require("jsonwebtoken");
var morgan = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var config = require("./webserver/config/configurations");
var authenticateUser = require("./webserver/authentication/authcontrol");

var app = express();

//connection for localinstance String
var mongo_url = config.mongoLocalConn;
//connecting to mongoose
mongoose.connect(mongo_url);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.onAppStart = function(addr) {
    console.log('Chat web app is now Running on port:', addr.port);
};
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/bower_components')));
app.use(express.static(path.join(__dirname, 'webapp')));

//authentications Routes
app.use('/api/user',authenticateUser);

module.exports = app;
