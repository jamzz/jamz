module.exports = function(){
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:6464';
  process.env.NODE_ENV     = process.env.NODE_ENV     || "development";
  process.env.PORT         = process.env.PORT         || 1337;
}
