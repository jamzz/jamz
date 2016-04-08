//This function is invoked immediately and gets express passed in from server.js
var bcrypt      = require('bcryptjs')
var Promise     = require('bluebird');
var uuid        = require('uuid');

var db = require('../db');

var compare = Promise.promisify(bcrypt.compare);
var hash    = Promise.promisify(bcrypt.hash);

module.exports = function(express) {
  var router = express.Router();

  router.route('/login')
    .post(function(req, res){
      if(! req || !req.body || !req.body.username || !req.body.password) {
        res.status(400).send("/auth/login expected a body with a username and password key");
      }

      var username = req.body.username;
      var password = req.body.password;
      //jack1234
      db('users').where({username: username}).select('username', 'password')
      .then(function(row){
        console.log("data retrieved", row[0])
        if(row[0].username === null || row[0].username === undefined)
          res.status(400).send("failed login")

        return compare(password, row[0].password)
      })
      .then(function(result){
        if(result) {
          var sessionId = uuid.v4();
          db('users').where({username: username}).update({sessionId: sessionId});
          res.cookie('sessionId', sessionId)
          res.status(200).send();
        }

        res.status(400).send("comparison failed");
      })
      .catch(function(err){
        console.log("login had problems", err);
      });
    })
    //because front end dev's are people too
    .all(function(req, res){
      res.status(404).send("Try using the POST method.")
    })

  router.route('/logout')
    .post(function(req, res) {
      res.clearCookie('sessionId');
      res.clearCookie('loggedIn');
      db('users').where({username: username}).update({sessionId: "null"});
      res.status(200).send("Logged out");
    })
    .all(function(req, res){
      res.status(404).send("Try using the POST method.")
    })

  router.route('/signup')
    .post(function(req, res){
      if(! req || !req.body || !req.body.username || !req.body.password) {
        res.status(400).send("/auth/login expected a body with a username and password key");
      }

      var username = req.body.username;
      var password = req.body.password;
      //jack1234
      db('users').where({username: username}).select('username')
      .then(function(row){
        console.log("data retrieved", row[0])
        if(row[0].username !== null || row[0].username !== undefined)
          res.status(400).send("failed signup")

        return hash( password, null, null )
      })
      .then(function(result){
        password = result;
        var sessionId = uuid.v4();

        res.cookie('sessionId', sessionId)
        db('users').insert({username: username, password: password, sessionId: sessionId});

        res.status(201).send();
      })
      .catch(function(err){
        console.log("login had problems", err);
      })
    })
    .all(function(req, res){
      res.status(404).send("Try using the POST method.")
    })

  return router;
}
