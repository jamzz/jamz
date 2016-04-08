//This function is invoked immediately and gets express passed in from server.js
var knex = require('../db')

module.exports = function(express) {

  var router = express.Router();

  // requests for users data
  router.route('/')
    .get(function(req, res){
      console.log('---received users GET, query='+JSON.stringify(req.query));
      var rq = req.query;
      if (rq && rq.id) {
        // handle request for individual user--------------
        console.log("user request for individual user id ",rq.id);
        knex('users').where({
          id: rq.id
        }).select('*')
        .then(function(data){
          console.log("user:request for user id "+rq.id+" successful. Returning: "+data[0]);
          res.status(200).send(data[0]);
        })
        .catch(function(error){
          console.log("user:request for user id "+rq.id+" failed. Error: "+error);
          res.status(400).send("Could not find requested user id ("+rq.id+")");
        })
      } else if (rq && rq.sessId){
        // handle request for users attached to a given session Id------
        console.log("user request for users attached to session ",rq.sessId);
        knex('session_users')
        .join('session', 'session_users.session_id', '=', 'session.id')
        .join('users', 'session_users.user_id', '=', 'users.id')
        .where({
          session_id : sessId
        }).select('*')
        .then(function(data){
          console.log("user:request for users by sessId "+rq.sessId+" successful. Returning: "+data[0]);
          res.status(200).send(data[0]);
        })
        .catch(function(error){
          console.log("user:request for users by sessId "+rq.id+" failed. Error: "+error);
          res.status(400).send("Could not find requested users by sessId ("+rq.id+")");
        })
      } else {
        // show all users-------------------------------
        knex.select().table('users')
        .then(function(data){
          console.log("user:/: returning:", data);
          res.status(200).send(data);          
        })
        .catch(function(err){
          console.log("Error retrieving users list: ", err);
          res.status(401).send(data);
        })
      }
    })
    //because front end dev's are people too
    .all(function(req, res){
      res.status(404).send("Try using the GET method.")
    })

  // update a user -- NOT TESTED
  router.route('/update') 
    .post(function(req, res) {
      console.log('received update user POST');
      if(! req || !req.body || !req.body.updateUser) {
        res.status(400).send("/user/update expected a body with an updateUser object");
      } else {
       // sanity check input
        var error = false; // TODO: checkUpdateBody(req.body.updateUser);
        if (!error){ // error will contain description of error, false if ok
          var bodyObj = req.body.updateUser;
          var uId = bodyObj.userId;
          db('users')
          .where('id', '=', sId)
          .update({
            username: bodyObj.username,
            //password: bodyObj.password,
            name: bodyObj.name,
            description: bodyObj.description,
            picture: bodyObj.picture,
            contactEmail: bodyObj.contactEmail,
            contactPhone: bodyObj.contactPhone
          })
          .then(function(data){
            console.log("user:user id "+uId+" successfully updated");
            res.status(201).send("user successfully updated:", data);
          })
          .catch(function(err){
            console.log("user:error updating user", err);
            res.status(401).send("error updating user", err);
          })
        } else {
        console.log('user:update:error: ',error);
        res.status(400).send(error);
        }
      }
    });










/*
  router.get('/:id', function(req, res){
    res.status(200).send('user was recieved with this id: ' + req.params.id + ". This endpoint will eventually return the users profile. If not found, 404.");
  })
*/
  return router;
}


