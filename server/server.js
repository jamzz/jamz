var express = require('express');
var path = require('path');
var Promise = require('bluebird');
var bodyParser = require('body-parser');

var app = express();
process.env.PORT = process.env.PORT || 1337;

var sampleUserData = {
  "name": "Bob",
  "instrument": ["bass", "drums", "trombone"],
  "contactInfo": {
    "email": "stupidBob@places.com",
    "phone": "123-456-7890",
  },
  "band": ["theSnazzyTurtles", "purpleTigers"],
  "description": "I like cats and turtles."
}

var sampleSeshData = {
  "title": "Come jam with ppl",
  "genre": ["jazz","rock","metal","classical"],
  "date": "4/30/2016",
  "time": "23:59:59",
  "paid": false,
  "instrumentNeeded": ["flute"],
  "description": ["We play lots of kinds of music because we hate the organizational system, man"],
  "XP": ">9000"
}


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

app.get('/sampleUserData', function(req,res){
  res.send(sampleUserData)
})

app.get('/sampleSeshData', function(req,res){
  res.send(sampleSeshData)
})

app.listen(process.env.PORT, function(){
  console.log('Jamzz is listening on port', process.env.PORT);
  console.log('request /sampleSeshData for sample jam session data');
  console.log('requiest /sampleUserData for sample profile data');
});
