//This function is invoked immediately and gets express passed in from server.js
var bcrypt      = require('bcryptjs')
var Promise     = require('bluebird');

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

      db('users').where({username: username}).select('username', 'password')
      .then(function(data){
        //if data doesn't exist, send 4xx response with a message.
        //else use bcrypt.compare to compare passwords. If it is not a match send the 4xx
        compare("B4c0/\/", hash)
        .then(function(result){
          if(result) {
            res.cookies
            res.status(200).send();
          }

          res.status(400).send();
        })
        res.status(200).send("You found logged in");
      });
    })
    //because front end dev's are people too
    .all(function(req, res){
      res.status(404).send("Try using the POST method.")
    })

  // router.route('/logout')
  //   .post(function(req, res) {
  //     if(! req || !req.body || !req.body.username || !req.body.password) {
  //       res.status(400).send("/auth/logout expected a body with a newUser key");
  //     }

  //     res.status(201).send("You found the endpoint for creating a user");
  //   })
  //   .all(function(req, res){
  //     res.status(404).send("Try using the POST method.")
  //   })

  router.route('/signup')
    .post(function(req, res) {
      if(! req || !req.body || !req.body.username || !req.body.password) {
        res.status(400).send("/auth/signup expected a body with a username and password key");
      }

      res.status(201).send("You found the endpoint for signung up");
    })
    .all(function(req, res){
      res.status(404).send("Try using the POST method.")
    })

  return router;
}

