module.exports = function(db){
  return db.insert([
    {
      paidAmount: 0,
      sessionId: "1234",
      title:"bob's jam session",
      date:"5/23/2016",
      time:"22:00:00",
      area:"Austin",
      location:"Bob's house",
      description:"lets play some blues",
      experience:"intermediate",
      owner: "userId or username"
    }
  ]).into('session')
  .catch(function(err){
    console.log("error inserting session seed", err);
  })
}

