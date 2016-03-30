var express = require('express');
var path = require('path');
var Promise = require('bluebird');
var bodyParser = require('body-parser');

var app = express();
process.env.PORT = process.env.PORT || 1337;

app.use( express.static(path.join(__dirname,'../client')) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( function(req, res, next){
  console.log("Jamzz recieved your request");
  next();
})

app.get('/', function(req, res){
  res.send();
})

app.listen(process.env.PORT);
console.log('Jamzz is listening on port', process.env.PORT);
