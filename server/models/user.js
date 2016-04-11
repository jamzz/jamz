//This function is invoked immediately and gets express passed in from server.js
var knex = require('../db')
var request = require('request');
var async = require('async');

module.exports = function(express) {

  var router = express.Router();

  // requests for users data
  router.route('/')
    .get(function(req, res){

      console.log("req.loggedIn", req.loggedIn);
      console.log('---received users GET, query='+JSON.stringify(req.query));
      var rq = req.query;
      if (rq && rq.id) {
        // handle request for individual user--------------
        console.log("user request for individual user id ",rq.id);
        getUserById(rq.id)
        .then(function(data){
          console.log("user:request for user id "+rq.id+" successful. Returning: "+data);
          res.status(200).send(JSON.stringify(data));
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
        //knex.select().table('users')
        getAllUsers()
        .then(function(data){
          console.log("user:/: returning:", JSON.stringify(data));
          res.status(200).send(JSON.stringify(data));          
        })
        .catch(function(err){
          console.log("Error retrieving users list: ", err);
          res.status(401).send(err);
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

  function getAllUsers(){
    return new Promise(function(resolve,reject){
      var output = [];
      knex.select('id').table('users')
      .then(function(ids){
        return ids.reduce(function(promise, item) {
          return promise.then(function() {
              return getUserById(item.id)
                .then(function(res) {
                  output.push(res);
              });
          });
        }, Promise.resolve());
      })
      .then(function(data){
        //console.log("output=",output);
        resolve(output);
      })
    });
  }

  function getUserById(uId){
    return new Promise(function(resolve,reject){
      // handle request for individual user-------------------
      async.parallel({
        queryone: function( parCb ){
          console.log("getting instruments");
          var query = knex('instrument').select('instrument').where({
            user_id: uId
          });
          query.exec( function(err, results ) {
            parCb( err, results );
          } );
        },
        querytwo: function( parCb ){
          console.log("getting bands");
          var query = knex('band').select('band').where({
            user_id: uId
          });
          query.exec( function(err, results ) {
            parCb( err, results );
          } );
        },
        /*
        querythree: function( parCb ){
          console.log("getting friends");
          var query = knex('users')
            .join('user_friend', 'users.id', '=', 'user_friend.user_id')
            .join('user_friend', 'users.id', '=', 'user_friend.friend_id')
          .where('user_friend.user_id', '=', uId)
          //.orWhere('user_friend.friend_id', '=', uId)
          //.whereNot('user.id', '=', uId)
          .select('username');
          query.exec( function(err, results ) {
            parCb( err, results );
          } );
        },
        */
        queryfour: function( parCb ){
          console.log("getting session data");
          var query = knex('session_users')
            .join('session', 'session_users.session_id', '=', 'session.id')
            .join('users', 'session_users.user_id', '=', 'users.id')
          .where({
            session_id : uId
          })
          .select('title','date','location');
          query.exec( function(err, results ) {
            parCb( err, results );
          } );
        },
        queryfive: function( parCb ){
          console.log("getting user data");
          var query = knex('users').select('*').where({
                id: uId
              });
          query.exec( function(err, results ) {
            parCb( err, results );
          } );
        },
      },
      function(err, results) {
        if (err){
          console.log("Error getting user data, id="+uId+", err:",err);
          reject(err);
        } else {
          console.log("putting it all together");
          var usr = {};
          var instruments = [];
          var bands = [];
          //var friends = [];
          var sessions = [];
          for (var i=0;i<results.queryone.length;i++){
            instruments.push(results.queryone[i].instrument)
          }
          for (var j=0;j<results.querytwo.length;j++){
            bands.push(results.querytwo[j].band);
          }
          //for (var k=0;k<results.querythree.length;k++){
          //  friends.push(results.querythree[k].username)
          //}
          //console.log("friends=",friends);
          usr = results.queryfive[0];
          usr['instruments'] = instruments;
          usr['bands'] = bands;
          //usr['friends'] = friends;
          usr['sessions'] = results.queryfour;
          //console.log("user:request for user by id "+uId+" successful. Returning: "+JSON.stringify(usr));
          resolve(usr);
        } 
      })
    });
  }






  // user/search
  router.route('/search')
    .get(function(req, res){

      console.log("----------------req.query------------", req.query);

      request('http://localhost:1337/user', function(err, response, body) {
        if(err) console.log(err);
        var users = JSON.parse(body);
        console.log(typeof users);

        if(typeof users === "string") throw new Error("I wanted an object, thx.")
        if(!req.query) throw new Error("didn't get a query")

        res.status(200).send(paginate(filterUsers(req.query, users), req.query.page));
      })
    })
    .all(function(req, res){
      res.status(404).send("Try get method");
    })


  function filterUsers(query, users){
    var currentList = users.slice();

    if(isValid(query.username))
      currentList = currentList.filter(byExactMatch.bind(null, query.username, "username"))

    if(isValid(query.name))
      currentList = currentList.filter(byExactMatch.bind(null, query.name, "name"))

    if(isValid(query.bands))
      currentList = currentList.filter(byArrayContainsMatch.bind(null, query.bands, "bands"))

    if(isValid(query.instruments))
      currentList = currentList.filter(byArrayContainsMatch.bind(null, query.instruments, "instruments"))

    return currentList
  }

  function paginate(arr, page){
  // recursive thingy
  //  if(page * 20 > arr.length)
  //    return paginate(arr, page-1);

    console.log("prepaginated arr", arr);

    page = page || 1;

    if(arr.length<20)
      return arr;

    return arr.slice( (page*20)-1, (page*20)+19 );
  }

  function byExactMatch(queryVal, curPath, cur) {
    return cur[curPath] === queryVal
  }

  function byArrayContainsMatch(queryVal, curPath, cur) {
    return cur[curPath].indexOf(queryVal) !== -1
  }

  function byPaid(queryVal, curPath, cur) {
    return (cur[curPath] > 0 && queryVal) || (cur[curPath] === 0 && queryVal)
      ? true
      : false;
  }

  function isValid(val){
    return val !== undefined && val !== ""
      ? true
      : false
  }


/*
  router.get('/:id', function(req, res){
    res.status(200).send('user was recieved with this id: ' + req.params.id + ". This endpoint will eventually return the users profile. If not found, 404.");
  })
*/
  return router;
}


