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

//Start server
app.listen(process.env.PORT, function(){
  console.log('');
  console.log('Listening on port ', process.env.PORT);
  console.log('');
  console.log('--ENDPOINTS--');
  console.log('GET  /  /user/  /user/:id  /session/  /session/:id  /session/search  /user/search');
  console.log('POST /session/create  /session/delete  /auth/login  /auth/logout  /auth/signup');
});


function isLoggedIn(req, res, next) {
  // if( !req.cookies ) {
  //   throw new Error("Cookes aren't parsed");
  // }
  console.log(req.url, req.method, "---isLoggedIn---", req.body, req.query); //req.cookies, 
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
