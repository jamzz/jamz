//Start postgres server
var pg = require('pg');
var client = new pg.Client(process.env.DATABASE_URL);
client.connect();
