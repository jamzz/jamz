//This function is invoked immediately and gets express passed in from server.js
var knex = require('../db')

module.exports = function(express) {

  var router = express.Router();

  router.route('/')
    .get(function(req, res){
      knex.select().table('session').then(function(data){
        console.log("jamSession:/: returning:", data);
        res.status(200).send(data);
      }).catch(function(err){
        console.log("Error retrieving session list: ", err);
        res.status(401).send(data);
      })
    })
    //because front end dev's are people too
    .all(function(req, res){
      res.status(404).send("Try using the GET method.")
    })

  router.route('/create')
    .post(function(req, res) {
      if(! req || !req.body || !req.body.newSession) {
        res.status(400).send("/session/create expected a body with a newSession object");
      } else {
        // sanity check input
        var error = checkCreateBody(req.body.newSession);
        if (!error){ // error will contain description of error, false if successful
          console.log("session create error: "+error);
          knex.table('session').insert(req.body.newSession).then(function (result){
            res.status(201).send('Success');
          }).catch(function(err){
            console.log("error inserting session: ", err);
            res.status(400).send("error inserting session: ",err);
          })
        } else {
          console.log('jamSession:create:error: ',error);
          res.status(400).send(error);
        }
      }
    })
    .all(function(req, res){
      res.status(404).send("Try using the POST method.");
    })

  router.get('/:id', function(req, res){
    knex('session').where({
      sessionId: req.params.id
    }).select('*')
   .then(function(data){
      console.log("jamSession:request for sessionId "+req.params.id+" successful. Returning: "+data[0]);
      res.status(200).send(data[0]);
    })
    .catch(function(error){
        console.log("jamSession:request for sessionId "+req.params.id+" failed. Error: "+error);
        res.status(400).send("Could not find requested sessionId ("+req.params.id+")");
    })
  });

  function checkCreateBody(obj){
    if (!obj.hasOwnProperty('paidAmount') || !(Number.isInteger(obj.paidAmount))) {
      return "paidAmount should be an integer value";
    } else if (!obj.hasOwnProperty('sessionId') || !(Number.isInteger(obj.sessionId))) {
      return "sessionId should be an integer value";
    } else if (!obj.hasOwnProperty('title') || (typeof obj.title !== 'string')) {
      return "title should be an string value";
    } else if (!obj.hasOwnProperty('date') || (typeof obj.date !== 'string')) {
      return "date should be an string value";
    } else if (!obj.hasOwnProperty('time') || (typeof obj.time !== 'string')) {
      return "time should be an string value";
    } else if (!obj.hasOwnProperty('area') || (typeof obj.area !== 'string')) {
      return "area should be an string value";
    } else if (!obj.hasOwnProperty('location') || (typeof obj.location !== 'string')) {
      return "location should be an string value";
    } else if (!obj.hasOwnProperty('description') || (typeof obj.description !== 'string')) {
      return "description should be an string value";
    } else if (!obj.hasOwnProperty('experience') || (typeof obj.experience   !== 'string')) {
      return "experience should be an string value";
    }
    return false;
  }

  return router;
}

