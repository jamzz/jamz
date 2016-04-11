module.exports = function(db){
  return db.insert([
    {
      username: "bob",
      password: "testPasswordBob",
      name:"bob cratchet",
      description:"I live in austin",
      picture:"http://catpicture.jpg",
      contactEmail:"example@gmail",
      contactPhone:"123-467-2356",
      sessionId:"asdfasdf"
    },
    {
      username: "jack",
      password: "testPasswordJack",
      name:"jack beanstalk",
      description:"I am visiting austin",
      picture:"http://dogpicture.jpg",
      contactEmail:"example@gmail",
      contactPhone:"973-467-2356",
      sessionId:"asdfasdf"
    },
    {
      username: "fred",
      password: "passwordFred",
      name:"fred flintstone",
      description:"I hate Austin",
      picture:"http://birdpicture.jpg",
      contactEmail:"example@gmail",
      contactPhone:"973-467-2356",
      sessionId:"asdfasdf"
    }
  ]).into('users')
  .catch(function(err){
    console.log("error inserting users seed", err);
  })
}
