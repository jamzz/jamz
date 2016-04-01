module.exports = function(db){
  return db.insert([
    {
      band: "fakeband2",
      user_id: 1
    },
    {
      band: "fakeband",
      user_id: 1
    },
  ]).into('band')
  .catch(function(err){
    console.log("error inserting band seed", err);
  })
}
