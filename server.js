var express = require('express');
var app = express();
var routes = require('./server/routes');
var bodyParser = require('body-parser');

global.__base = __dirname + "/";

//===========
// Bodyparser
//===========
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//=====================
// Route import & setup
//=====================
app.use('/', routes);

//=============
// Static Files
//=============
app.use(express.static('public'));



app.listen(8080);

console.log('Server hosted at :8080');