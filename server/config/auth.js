var session     = require('express-session');
var uuid        = require('uuid');
var bcrypt      = require('bcrypt')

var db = require('../db');


module.exports = function(app, express) {

  app.use(session(
    {
      genid: uuid.v4,
      secret: 'sosecretyoudneverguessitlikeforreal',
      resave: true,
      saveUninitialized: true
    }
  ))
}
