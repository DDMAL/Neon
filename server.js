var express = require('express');
var app = express();
var routes = require('./server/routes/index');
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

//=====================
// Templating Engine
//=====================

app.set('view engine', 'pug');

//=============
// Static Files
//=============
app.use(express.static('public'));

app.listen(9000);

console.log('Server hosted at :9000');
