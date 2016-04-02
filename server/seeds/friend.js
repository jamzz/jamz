module.exports = function(db){
  return db.insert([{user_id: 1, friend_id:2}]).into('user_friend') //unsure about this
  .catch(function(err){
    console.log("error within user_friend seed", err);
  })
}
