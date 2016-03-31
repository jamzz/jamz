//Start postgres server
var pg = require('pg');
var client = new pg.Client("pg://postgres:postgres@localhost:5432");
client.connect();
