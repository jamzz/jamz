//This function is invoked immediately and gets express passed in from server.js
var knex = require('../db')
var async = require('async');
var request = require('request');

module.exports = function(express) {

  var router = express.Router();

  // requests for jam session data
  router.route('/')
    .get(function(req, res){
      console.log('---received sessions GET, query='+JSON.stringify(req.query));
      var rq = req.query;
      if (rq && rq.id) {
        console.log("request for sessionId = ",rq.id);
        // handle request for individual session-------------------
        getSessionById(rq.id)
        .then(function(data){
          console.log("returning session id data", data);
          res.status(200).send(JSON.stringify(data));
        })
        .catch(function(err){
          console.log("could not get session data by id "+rq.id+", err:", err);
          res.status(400).send(err);
        })
      } else if (rq && rq.name) {
        // handle request to get list of sessions by username-------
        console.log("requested username = "+rq.name);
        getSessionsByName(rq.name)
        .then(function(data){
          console.log("jamSession:request for sessions by username "+rq.name+" successful. Returning: "+JSON.stringify(data));
          res.status(200).send(JSON.stringify(data));
        })
        .catch(function(error){
          console.log("jamSession:request for sessions by username "+rq.name+" failed. Error: "+error);
          res.status(400).send("Could not find requested sessions by name ("+rq.name+")");
        })
      } else {
        // default to show all sessions-------------------------------
        getAllSessions()
        .then(function(data){
          console.log("jamSession:/: returning:", JSON.stringify(data));
          res.status(200).send(JSON.stringify(data));
        })
        .catch(function(err){
          console.log("Error retrieving session list: ", err);
          res.status(400).send("Could retrieve sessions, error:",err);
        })
      }
    })
    //because front end dev's are people too
    .all(function(req, res){
      res.status(404).send("Try using the GET method.")
    });

  // create a new jam session
  router.route('/create')
    .post(function(req, res) {
      console.log('received create session POST');
      var sId = 0;
      if(! req || !req.body || !req.body.newSession) {
        res.status(400).send("/session/create expected a body with a newSession object");
      } else {
        // sanity check input
        //var error = checkCreateBody(req.body.newSession);
        if (true){ // error will contain description of error, false if ok
          var bodyObj = req.body.newSession;
          // build object for insertion into sessions table
          var sessionObj = {};
          sessionObj.paidAmount = bodyObj.paidAmount;
          //sessionObj.sessionId = bodyObj.sessionId;
          sessionObj.title = bodyObj.title;
          sessionObj.date = bodyObj.date;
          sessionObj.time = bodyObj.time;
          sessionObj.area = bodyObj.area;
          sessionObj.location = bodyObj.location;
          sessionObj.description = bodyObj.description;
          sessionObj.experience = bodyObj.experience;
          sessionObj.owner = req.user;
          knex.table('session').returning('id').insert(sessionObj)
          .then(function (rows){
            console.log("insert into session returned ", rows);
            sId = rows[0]; // sId = id of session table, needed for foreign key for inserts

            // insert needed instrument (Strings) into needInstrument table
            console.log("bodyObj.needInstruments",bodyObj.needInstruments)
            var needArr = bodyObj.needInstruments;
            // build array for insert command
            var insertArr = [];
            for (var i=0;i<needArr.length;i++){
              insertArr.push({session_id: sId, instrument: needArr[i]});
            }
            console.log("jamSession:create:needInstrument",insertArr);
            return knex('needInstrument').insert(insertArr)
          })
          /*
          .then(function(data){
            // insert session musicians into session_users table
            console.log("bodyObj.musicians",bodyObj.musicians)
            var musicians = bodyObj.musicians; // TODO: name of field in body??? How does the user specify another user? By name? By user_id?
            insertArr = [];
            for (var j=0;j<musicians.length;j++){
              insertArr.push({session_id: sId, musician: musicians[j]});
            }
            console.log("musicians:insertArr",insertArr, musicians[0]);
            return knex('session_users').insert(insertArr)  
          })
          */
          .then(function(data){
            // insert session genres into genres table
            console.log("bodyObj.genres",bodyObj.genres)
            var genres = bodyObj.genres;
            insertArr = [];
            for (var k=0;k<genres.length;k++){
              insertArr.push({session_id: sId, genre: genres[k]});
            }
            console.log("genres:insertArr",insertArr, genres[0]);
            knex('genre').insert(insertArr)
            .then(function (result){
              res.status(201).send('Success');
            })
          })
          .catch(function(err){
              console.log("error inserting session: ", err);
              res.status(400).send("error inserting session: ",err);
            })
          }
        }
      })
      .all(function(req, res){
        res.status(404).send("Try using the POST method.");
      }); 

  // delete a jam session
  router.route('/delete')
    .post(function(req, res) {
    console.log('---received session delete POST');
    if(! req || !req.body || !req.body.deleteSession) {
      res.status(400).send("/session/delete expected a body with a deleteSession object");
    } else {
      //if (req.loggedIn){  // TODO: check to insure owner is one deleting session
        // sanity check input
        var error = checkDeleteBody(req.body);
        if (!error){ // error will contain description of error, false if ok
          var sId = req.body.deleteSession;
          knex("session")
            .del()
            .where({
              id: sId
            })
            .then(function(data){
              console.log("jamSession:session id "+sId+" successfully deleted");
              res.status(201).send("session successfully deleted:", data);
            })
            .catch(function(err){
              console.log("jamSession:error deleting session", err);
              res.status(400).send("error deleting session", err);
            })
          } else {
          console.log('jamSession:delete:error: ',error);
          res.status(400).send(error);
          }
        //}
      }
  })
  .all(function(req, res){
    res.status(404).send("Try using the POST method.")
  });

  // join a jam session
  router.route('/join') 
    .post(function(req, res) {
      console.log('received join session POST');
      console.log(req.body);
      if(!req || !req.body) {
        res.status(400).send("/session/join expected body {jamSessionId: integer}");
      } else {
       // sanity check input
        var error = false; // TODO: checkJoinBody(req.body.joinSession);
        if (!error){
          // query user table by username to get primary id
          knex('users').where('username', '=', req.user).select('id')
          .then(function(data){
            console.log("join:user data:", data);
            // insert record into session_users
            return knex('session_users').insert({'session_id': JSON.parse(req.body.jamSessionId), 'user_id': data[0].id })
          })
          .then(function(data){
            res.status(200).send("it worked");            
          })
          .catch(function(err){
            console.log("join:err:",err);
            res.status(400).send("it failed")
          });
        }
      }
    });

  // update a jam session -- NOT TESTED YET, does not yet handle instruments, bands
  router.route('/update') 
    .post(function(req, res) {
      console.log('received update session POST');
      if(!req || !req.body || !req.body.updateSession) {
        res.status(400).send("/session/update expected a body with a newSession object");
      } else {
       // sanity check input
        var error = false; // TODO: checkUpdateBody(req.body.updateSession);
        if (!error){ // error will contain description of error, false if ok
          var bodyObj = req.body.updateSession;
          var sId = bodyObj.sessId;
          db('session')
          .where('id', '=', sId)
          .update({
            paidAmount: bodyObj.paidAmount,
            sessionId: bodyObj.sessionId,
            title: bodyObj.title,
            date: bodyObj.date,
            time: bodyObj.time,
            area: bodyObj.area,
            location: bodyObj.location,
            description: bodyObj.description,
            experience: bodyObj.experience
          })
          .then(function(data){
            console.log("jamSession:session id "+sId+" successfully updated");
            res.status(201).send("session successfully updated:", data);
          })
          .catch(function(err){
            console.log("jamSession:error updating session", err);
            res.status(400).send("error updating session", err);
          })
        } else {
        console.log('jamSession:update:error: ',error);
        res.status(400).send(error);
        }
      }
    });

  function checkCreateBody(obj){ // TODO: sanity check additional fields, needInstruments, musicians(?)
    if (!obj.hasOwnProperty('paidAmount') || !(Number.isInteger(obj.paidAmount))) {
      return "paidAmount should be an integer value";
    //} else if (!obj.hasOwnProperty('sessionId') || !(Number.isInteger(obj.sessionId))) {
    //  return "sessionId should be an integer value";
    } else if (!obj.hasOwnProperty('title') || (typeof obj.title !== 'string')) {
      return "title should be a string value";
    } else if (!obj.hasOwnProperty('date') || (typeof obj.date !== 'string')) {
      return "date should be a string value";
    } else if (!obj.hasOwnProperty('time') || (typeof obj.time !== 'string')) {
      return "time should be a string value";
    } else if (!obj.hasOwnProperty('area') || (typeof obj.area !== 'string')) {
      return "area should be a string value";
    } else if (!obj.hasOwnProperty('location') || (typeof obj.location !== 'string')) {
      return "location should be a string value";
    } else if (!obj.hasOwnProperty('genre') || (typeof obj.location !== 'string')) {  // TODO: change this to 'genres'
      return "genre should be a string value";
    } else if (!obj.hasOwnProperty('description') || (typeof obj.description !== 'string')) {
      return "description should be a string value";
    } else if (!obj.hasOwnProperty('experience') || (typeof obj.experience   !== 'string')) {
      return "experience should be a string value";
    } else if (!obj.hasOwnProperty('needInstruments') || (!Array.isArray(obj.needInstruments))) { // TODO: change this to 'needed'
      return "neededInstruments should be an array of string values"; // TODO: check contents of these arrays
    } else if (!obj.hasOwnProperty('musicians') || (!Array.isArray(obj.musicians))) { // TODO: remove this requirement
      return "musicians should be an array of string values";
    }
    return false;
  }

  // this function checks to insure the value supplied is an integer
  function checkDeleteBody(obj){
    if (!obj.hasOwnProperty('deleteSession') || !(Number.isInteger(obj.deleteSession))) {
      return "deleteSession should be an integer value";
    }
    return false;
  }

  // this function will return all sessions in the session table
  function getAllSessions(){
    return new Promise(function(resolve,reject){
      var output = [];
      knex.select('id').table('session') // get all the session id's
      .then(function(ids){   // then go through them,
        return ids.reduce(function(promise, item) {
          return promise.then(function() { // getting the data for each
              return getSessionById(item.id)
                .then(function(res) {
                  output.push(res); // and pushing it onto the output array
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

  // this function goes through the session_users join table and gets
  // all the session id's that a user is attached to. It then goes
  // through that list and collects the session data for each
  function getSessionsByName(uName) {
    return new Promise(function(resolve,reject){
      var output = [];
      knex('session_users')  // get all the id's with a triple double on the three tables
      .join('session', 'session_users.session_id', '=', 'session.id')
      .join('users', 'session_users.user_id', '=', 'users.id')
      .where({
        username: uName   // select by username in the users table
      })
      .select('session.id')   // get the session id associated with each
      .then(function(ids){
        return ids.reduce(function(promise, item) { // go thru those id's
          return promise.then(function() {
              return getSessionById(item.id)  // and get the data for each
                .then(function(res) {
                  output.push(res);  // and push it onto the output array
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

  // This function is called by the two above functions to collect jam session data
  // it is passed an id value (the key of the session table) and returns the requested
  // data. It uses the async library to parallelize the requests for the data from
  // other tables that hold data for the request (such as needInstruments, and the 
  // session_users join table). It starts each query, then when all have completed it
  // puts the collected information together into the response.
  function getSessionById(sId){
    return new Promise(function(resolve,reject){
      // handle request for individual session-------------------
      // Make four different queries at the same time
      // one for the session genre info
      // one for the needed instruments info
      // one for the participants info
      // and one for the session info
      async.parallel({
        queryone: function( parCb ){
          console.log("getting genres");
          var query = knex('genre').select('genre').where({
            session_id: sId
          });
          query.exec( function(err, results ) {
            parCb( err, results );
          } );
        },
        querytwo: function( parCb ){
          console.log("getting needInstruments");
          var query = knex('needInstrument').select('instrument').where({
            session_id: sId
          });
          query.exec( function(err, results ) {
            parCb( err, results );
          } );
        },
        querythree: function( parCb ){
          console.log("getting participants");
          var query = knex('session_users')
            .join('session', 'session_users.session_id', '=', 'session.id')
            .join('users', 'session_users.user_id', '=', 'users.id')
          .where({
            session_id : sId
          })
          .select('username');
          query.exec( function(err, results ) {
            parCb( err, results );
          } );
        },
        queryfour: function( parCb ){
          console.log("getting session data");
          var query = knex('session').select('*').where({
                id: sId
              });
          query.exec( function(err, results ) {
            parCb( err, results );
          } );
        },
      },
      // once all the requests have completed, put the information together into
      // the response
      function(err, results) {
        if (err){
          console.log("Error getting session data, id="+sId+", err:",err);
          reject(err);
        } else {
          console.log("putting it all together");
          var ssn = {};
          var genres = [];
          var instruments = [];
          var participants = [];
          for (var i=0;i<results.queryone.length;i++){
            genres.push(results.queryone[i].genre)
          }
          for (var j=0;j<results.querytwo.length;j++){
            instruments.push(results.querytwo[j].instrument);
          }
          for (var k=0;k<results.querythree.length;k++){
            participants.push(results.querythree[k].username)
          }
          ssn = results.queryfour[0];
          ssn.genres = genres;
          ssn.instruments = instruments;
          ssn.participants = participants;
          console.log("jamSession:request for session by id "+sId+" successful. Returning: "+JSON.stringify(ssn));
          resolve(ssn);
        } 
      })
    });
  }

  // session/search
  router.route('/search')
    .get(function(req, res){

      request('http://localhost:1337/session', function(err, response, body) {
        if(err) console.log(err);
        var sessions = JSON.parse(body);

        if(typeof sessions === "string") throw new Error("I wanted an object, thx.")
        if(!req.query) throw new Error("didn't get a query")

          console.log("req.body", req.body, "req.query", req.query, Object.keys(req.query), Object.keys(req.body))

        res.status(200).send(paginate(filterSessions(req.query, sessions), req.query.page));
      })
    })
    .all(function(req, res){
      res.status(404).send("Try get method");
    })

    router.route('/owned') //need sessionId
       .get(function(req, res){
          request('http://localhost:1337/session', function(err, response, body) {
            if(err) console.log(err);
            var sessions = JSON.parse(body);
            if(typeof sessions === "string") throw new Error("I wanted an object, thx.")
            if(!req.query) throw new Error("didn't get a query")
              console.log("req.body", req.body, "req.query", req.query, Object.keys(req.query), Object.keys(req.body))
            res.status(200).send(paginate(sessions.filter(byExactMatch.bind(null, req.name, "owner")), req.query.page));
          })
       })
       .all(function(req, res){
         res.status(404).send("Try get");
       })

  function filterSessions(query, sessions){
    console.log("filterSessions:query:",query, sessions);

    var currentList = sessions.slice();

    if(isValid(query.neededInstruments))
      currentList = currentList.filter(byArrayContainsMatch.bind(null, query.neededInstruments, "neededInstruments"))

    if(isValid(query.genre))
      currentList = currentList.filter(byArrayContainsMatch.bind(null, query.genre, "genres"))

    if(isValid(query.paidAmount))
      currentList = currentList.filter(byPaid.bind(null, query.paidAmount, "paidAmount"));

    if(isValid(query.title))
      currentList = currentList.filter(byExactMatch.bind(null, query.title, "title"))

    if(isValid(query.area))
      currentList = currentList.filter(byExactMatch.bind(null, query.area, "area"))

    if(isValid(query.musician))
      currentList = currentList.filter(byArrayContainsMatch.bind(null, query.musician, "musician"))

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


  return router;
}

