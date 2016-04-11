module.exports = function(db){
  return db.insert([
    {
      session_id: 1,
      user_id: 1
    },
    {
      session_id: 1,
      user_id: 2
    },
  ]).into('session_users')
  .catch(function(err){
    console.log("error inserting session_user seed", err);
  })
}
