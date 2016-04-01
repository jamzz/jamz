module.exports = function(db){
  return db.insert([
    {
      instrument: "flute",
      user_id: 1
    },
    {
      instrument: "lute",
      user_id: 1
    },
  ]).into('instrument')
  .catch(function(err){
    console.log("error inserting instrument seed", err);
  })
}
