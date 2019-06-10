/* eslint spaced-comment: ["error", "always", { "exceptions": ["="] }] */
var express = require('express');
var app = express();
var routes = require('./server/routes/index');
var bodyParser = require('body-parser');

global.__base = __dirname + '/';

//===========
// Bodyparser
//===========
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

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

app.listen(8080);

console.log('Server hosted at :8080');
