module.exports = function(db){
  return db.insert([{genre: "rock", session_id:1}, {genre: "roll", session_id:1}]).into('genre') //unsure about this
  .catch(function(err){
    console.log("error within genre seed", err);
  })
}
