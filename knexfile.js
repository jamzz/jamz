module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      database: 'dev_db'
    },
    seeds: {
      directory: './seeds/dev'
    }
  }
};
