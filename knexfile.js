var knex = require('knex')({
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: 'knex,public'
  },
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: 'knex,public'
  }
});
