//This function is invoked immediately and gets express passed in from server.js
var knex = require('../db')

module.exports = function(express) {

  var router = express.Router();

  router.route('/')
    .get(function(req, res){
      res.status(200).send("You found the endpoint for returning all users");
    })
    //because front end dev's are people too
    .all(function(req, res){
      res.status(404).send("Try using the GET method.")
    })

  router.get('/:id', function(req, res){
    res.status(200).send('user was recieved with this id: ' + req.params.id + ". This endpoint will eventually return the users profile. If not found, 404.");
  })

  return router;
}


