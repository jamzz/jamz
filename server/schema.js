var knex = require('./db');


knex.schema.createTableIfNotExists('user', function(table) {
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
  table.foreign('user_id').references('id').inTable('user');
})
//user id is lower than friend id
.createTableIfNotExists('user_friend', function(table) {
  table.foreign('user_id').references('id').inTable('user');
  table.foreign('friend_id').references('id').inTable('user');
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
  table.foreign('session_id').references('id').inTable('session');
  table.foreign('user_id').references('id').inTable('user');
})

.createTableIfNotExists('needInstrument', function(table) {
  table.string('instrument');
  table.foreign('session_id').references('id').inTable('session');
})

.createTableIfNotExists('genre', function(table) {
  table.string('genre');
  table.foreign('session_id').references('id').inTable('session');
})
// .then(function (result) {
//   console.log('Successfully applied schema.');
//   knex.destroy();
// })
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
//   knex.schema.dropTable('user'),
// ])

