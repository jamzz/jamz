var db             = require('../db');

var users          = require('./users');
var band           = require('./band');
var user_friend    = require('./friend');
var session        = require('./session');
var session_user   = require('./sessionUser');
var needInstrument = require('./needInstrument');
var genre          = require('./genre');
var instrument     = require('./instrument');


(function(){
  users(db)
  .then(function(){
    return band(db);
  })
  .then(function(){
    return user_friend(db)
  })
  .then(function(){
    return session(db)
  })
  .then(function(){
    return session_user(db)
  })
  .then(function(){
    return needInstrument(db)
  })
  .then(function(){
    return genre(db)
  })
  .then(function(){
    return instrument(db)
  })
  .then(function(){
    console.log("No errors, killing connection.");
    db.destroy();
  })
  .catch(function(){
    console.log("seeder.js failed");
  })
})();
