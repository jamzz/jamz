module.exports = function(db){
  return db.insert([
    {
      userId: 3464257,
      username: "bob1234",
      password: "testPasswordBob",
      name:"bob",
      description:"I live in austin",
      picture:"http://catpicture.jpg",
      contactEmail:"example@gmail",
      contactPhone:"123-467-2356"
    },
    {
      userId: 23457,
      username: "jack1234",
      password: "testPasswordJack",
      name:"jack",
      description:"I am visiting austin",
      picture:"http://dogpicture.jpg",
      contactEmail:"example@gmail",
      contactPhone:"973-467-2356"
    },
  ]).into('users')
  .catch(function(err){
    console.log("error inserting users seed", err);
  })
}
