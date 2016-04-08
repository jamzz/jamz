module.exports = function(db){
  return db.insert([
    {
      instrument: "flute",
      session_id: 1
    },
    {
      instrument: "lute",
      session_id: 1
    },
  ]).into('needInstrument')
  .catch(function(err){
    console.log("error inserting needInstrument seed", err);
  })
}
