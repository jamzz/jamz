//configure knex
var configEnvironment = require('./config/environment');
var config = require('../knexfile');
var knex = require('knex')(config["development"]);

module.exports = knex;
