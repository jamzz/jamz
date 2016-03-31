var knex = require('./db');


knex.schema.createTableIfNotExists('users', function(table) {
  table.increments('id').primary();
  table.integer('userId');
  table.string('username');
  table.string('name');
  table.string('description');
  table.string('picture');
  table.string('contactEmail');
  table.string('contactPhone');
  table.timestamps();
})
.createTableIfNotExists('bands', function(table) {
  table.string('band');
  table.integer('user_id').references('id').inTable('users');
})
//user id is lower than friend id
.createTableIfNotExists('user_friend', function(table) {
  table.integer('user_id').references('id').inTable('users');
  table.integer('friend_id').references('id').inTable('users');
})
.createTableIfNotExists('session', function(table) {
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
.createTableIfNotExists('session_user', function(table) {
  table.integer('session_id').references('id').inTable('session');
  table.integer('user_id').references('id').inTable('users');
})

.createTableIfNotExists('needInstrument', function(table) {
  table.string('instrument');
  table.integer('session_id').references('id').inTable('session');
})

.createTableIfNotExists('genre', function(table) {
  table.string('genre');
  table.integer('session_id').references('id').inTable('session');
})
.then(function (result) {
  console.log('Successfully applied schema.');
  knex.destroy();
})
.catch(function (error) {
  console.log('Warning: Database Error', error);
});

// return Promise.all([
//   knex.schema.dropTable('genre'),
//   knex.schema.dropTable('needInstrument'),
//   knex.schema.dropTable('session')
//   knex.schema.dropTable('session_user'),
//   knex.schema.dropTable('user_friend')
//   knex.schema.dropTable('bands'),
//   knex.schema.dropTable('users'),
// ])

