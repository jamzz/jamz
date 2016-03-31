//configure knex
var config = require('../../knexfile.js');
var knex   = require('knex')(config[process.env.NODE_ENV]);

module.exports = knex;

knex.migrate.latest([config]);


knex.schema.createTableIfNotExists('bands', function(table) {
  table.string('band');
  table.foreign('user_id').references('id').inTable('user');
})

knex.schema.createTableIfNotExists('user', function(table) {
  table.increments('id').primary();
  table.integer('userId');
  table.string('username');
  table.string('name');
  table.string('description');
  table.string('picture');
  table.string('contactEmail');
  table.string('contactPhone');
  table.string('name');
  table.timestamps();
})

knex.schema.createTableIfNotExists('session_user', function(table) {
  table.foreign('session_id').references('id').inTable('session');
  table.foreign('user_id').references('id').inTable('user');
})

//user id is lower than friend id
knex.schema.createTableIfNotExists('user_friend', function(table) {
  table.foreign('user_id').references('id').inTable('user');
  table.foreign('friend_id').references('id').inTable('user');
})

knex.schema.createTableIfNotExists('session', function(table) {
  table.increments('id').primary();
  table.integer('paidAmount');
  table.integer('sessionId');
  table.string('title');
  table.string('date');
  table.string('time');
  table.string('area');
  table.string('location');
  table.string('description');
  table.string('experience');
  table.timestamps();
})

knex.schema.createTableIfNotExists('needInstrument', function(table) {
  table.string('instrument');
  table.foreign('session_id').references('id').inTable('session');
})

knex.schema.createTableIfNotExists('genre', function(table) {
  table.string('genre');
  table.foreign('session_id').references('id').inTable('session');
})
