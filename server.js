var express = require('express');
var app = express();
var logger = require('morgan');
var fs = require('fs');
var router = express.Router();
const AWS = require('aws-sdk');
var bodyParser = require('body-parser');
var path = require('path');
const dotenv = require('dotenv');
var routes = require('./api.js')(router);
dotenv.config();
// var autoIncrement = require('mongoose-auto-increment');


// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

//middleware
app.use(logger('dev'));
app.use(logger('common', {stream: fs.createWriteStream('./access.log', {flags: 'a'})}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true}));
// app.use(express.static(__dirname + '/public'));
app.use('/api',routes);
app.use(express.static(path.join(__dirname + '/dist')));
    
// Routes
app.get('*', function(req, res, err){
    res.sendFile(path.join(__dirname + "/dist/index.html"));
});

var server = app.listen(process.env.PORT || 3100, function(){
    var port = this.address().port; 
    console.log ('App server listening on port ' + port);
});
