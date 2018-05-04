var express = require('express');
var app = express();
var routes = require('./server/routes');

global.__base = __dirname + "/";

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