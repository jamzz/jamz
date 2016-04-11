//Packages
var path = require('path');
var uuid = require('uuid');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

//Local
var authModel = require('./models/auth')(express);
var userModel = require('./models/user')(express);
var jamSessionModel = require('./models/jamSession')(express);
var configEnvironment = require('./config/environment');
var db = require('./db');

//Production compatibility
configEnvironment();

var app = express();

//Standard Middleware
app.use(cookieParser());
app.use( express.static(path.join(__dirname,'../client')) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

//Routers
app.use('/user', isLoggedIn, userModel);
app.use('/session', isLoggedIn, jamSessionModel);
app.use('/auth', authModel);

//Serve test data
configTestData();

//Start server
app.listen(process.env.PORT, function(){
  console.log('');
  console.log('Listening on port ', process.env.PORT);
  console.log('');
  console.log('--ENDPOINTS--');
  console.log('GET  /  /sampleSeshData  /sampleUserData  /user/  /user/:id  /session/  /session/:id ');
  console.log('POST /session/create  /auth/login  /auth/logout  /auth/signup');
});


function isLoggedIn(req, res, next) {
  if( !req.cookies ) {
    throw new Error("Cookes aren't parsed");
  }
  console.log("auth:isLoggedIn:",req.cookies, req.body, req.query); 
  db('users').where({sessionId: req.query.sessionId}).select("username") // used to use req.cookies
  .then(function(row){
    console.log("data retrieved", row[0])
    if(row[0] === null || row[0] === undefined)
      req.loggedIn = false;

    else{
      console.log("row0=",row[0]);
      req.loggedIn = true;
      req.user = row[0].username;
    }

    next();
  })
  .catch(function(err){
    if(err instanceof Error) throw err;
    console.log("in strict auth middleware", err);
    next();
  })
}


function configTestData() {

  var sampleUserData = {
    "userId": "sampleId",
    "username": "bob125",
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

// var db = require('./db');
// //jack1234
// db('users').select('*')
// .then(function(row){
//   console.log("data retrieved", row)
// })

  app.get('/sampleSeshData', function(req,res){
    //they wanted a list
    var users = [];
    for(var i=0; i<29; i++) {
      users.push(sampleSeshData);
    }

    res.send(users);
  })
}
