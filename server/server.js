//Packages
var express = require('express');
var path = require('path');
var Promise = require('bluebird');
var bodyParser = require('body-parser');

//Local
var userModel = require('./models/user')(express);
var jamSessionModel = require('./models/jamSession')(express);
var configEnvironment = require('./config/environment');
var launchPostgreSQL = require('./config/postgres');

//Production compatibility
configEnvironment();

var app = express();

//Standard Middleware
app.use( express.static(path.join(__dirname,'../client')) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

//Routers
app.use('/user', userModel);
app.use('/session', jamSessionModel);

//Main
app.get('/', function(req, res){
  res.send();
})

//Serve test data
configTestData();

//Start server
app.listen(process.env.PORT, function(){
  console.log('');
  console.log('Listening on port ', process.env.PORT);
  console.log('');
  console.log('--ENDPOINTS--');
  console.log('GET  /  /sampleSeshData  /sampleUserData  /user/  /user/:id  /session/  /session/:id ');
  console.log('POST /user/create  /session/create');
});


function configTestData() {
  var sampleUserData = {
    "userId": "sampleId",
    "username": "bob125"
    "name": "Bob",
    "picture": "http://picture",
    "instruments": ["bass", "drums", "trombone"],
    "contactInfo": {
      "email": "stupidBob@places.com",
      "phone": "123-456-7890"
    },
    "bands": ["theSnazzyTurtles", "purpleTigers"],
    "description": "I like cats and turtles.",
    "friends": [],
    "sessions": []
  }

  var sampleSeshData = {
    "sessionId": "sampleSeshId",
    "title": "Come jam with ppl",
    "genres": ["jazz","rock","metal","classical"],
    "date": "4/30/2016",
    "time": "23:59:59",
    "area": "Austin",
    "location": "Stubs",
    "paidAmount": 0,
    "instrumentsNeeded": ["flute"],
    "description": "We play lots of kinds of music because we hate the organizational system, man",
    "experience": ">9000",
    "participants": []
  }

  app.get('/sampleUserData', function(req,res){
    //they wanted a list
    var users = [];
    for(var i=0; i<29; i++) {
      users.push(sampleUserData);
    }

    res.send(users);
  })

  app.get('/sampleSeshData', function(req,res){
    //they wanted a list
    var users = [];
    for(var i=0; i<29; i++) {
      users.push(sampleSeshData);
    }

    res.send(users);
  })
}
