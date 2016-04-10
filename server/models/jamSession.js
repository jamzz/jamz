//This function is invoked immediately and gets express passed in from server.js
var knex = require('../db')
var async = require('async');

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
          console.log("returning session id data");
          res.status(200).send(JSON.stringify(data));
        })
        .catch(function(err){
          console.log("could not get session data by id "+rq.id+", err:", err);
          res.status(400).send(err);
        })
      } else if (rq && rq.name) {
        // handle request to get list of sessions by username-------
        console.log("requested username = "+rq.name);
        rq.name="jack";
        knex('session_users')
        .join('session', 'session_users.session_id', '=', 'session.id')
        .join('users', 'session_users.user_id', '=', 'users.id')
        .where({
          username: rq.name
        }).select('*')
        .then(function(data){
          console.log("jamSession:request for sessions by username "+rq.name+" successful. Returning: "+data[0]);
          res.status(200).send(data[0]);
        })
        .catch(function(error){
          console.log("jamSession:request for sessions by username "+rq.name+" failed. Error: "+error);
          res.status(400).send("Could not find requested sessions by name ("+rq.name+")");
        })
      } else {
        // show all sessions-------------------------------
        knex.select().table('session')
        .then(function(data){
          console.log("jamSession:/: returning:", data);
          res.status(200).send(data);
        })
        .catch(function(err){
          console.log("Error retrieving session list: ", err);
          res.status(401).send(data);
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
      if(! req || !req.body || !req.body.newSession) {
        res.status(400).send("/session/create expected a body with a newSession object");
      } else {
        // sanity check input
        var error = checkCreateBody(req.body.newSession);
        if (!error){ // error will contain description of error, false if ok
          var bodyObj = req.body.newSession;
          // build object for insertion into sessions table
          var sessionObj = {};
          sessionObj.paidAmount = bodyObj.paidAmount;
          sessionObj.sessionId = bodyObj.sessionId;
          sessionObj.title = bodyObj.title;
          sessionObj.date = bodyObj.date;
          sessionObj.time = bodyObj.time;
          sessionObj.area = bodyObj.area;
          sessionObj.location = bodyObj.location;
          sessionObj.description = bodyObj.description;
          sessionObj.experience = bodyObj.experience;
          knex.table('session').returning('id').insert(sessionObj)
          .then(function (rows){
            console.log("insert into session returned ", rows);
            var sId = rows[0]; // sId = id of session table, needed for foreign key for inserts

            // insert needed instrument (Strings) into needInstrument table
            var needArr = bodyObj.needInstruments; // TODO: what name of field in body???
            // build array for insert command
            var insertArr = [];
            for (var i=0;i<needArr.length;i++){
              insertArr.push({sessionId: sId, instrument: needArr[i]});
            }
            knex('needInstrument').insert(insertArr)

            // insert session musicians into session_users table
            var musicians = bodyObj.musicians; // TODO: name of field in body???
            insertArr = [];
            for (var j=0;i<needArr.length;j++){
              insertArr.push({sessionId: sId, musician: musicians[j]});
            }
            knex('session_users').insert(insertArr)

            .then(function (result){
              res.status(201).send('Success');
            })
            .catch(function(err){
              console.log("error inserting session: ", err);
              res.status(401).send("error inserting session: ",err);
            })
          })
          .catch(function(err){
            res.status(401).send("error inserting session");
          })
        } else {
          console.log('jamSession:create:error: ',error);
          res.status(400).send(error);
        }
      }
    })
    .all(function(req, res){
      res.status(404).send("Try using the POST method.");
    }); 

  // delete a jam session -- TRIED THIS, don't know why the del() function doesn't work
  router.route('/delete')
    .post(function(req, res) {
    console.log('---received session delete POST');
    if(! req || !req.body || !req.body.deleteSession) {
      res.status(400).send("/session/delete expected a body with a deleteSession object");
    } else {  // TODO: need to verify this is the owner doing this
        // sanity check input
        var error = checkDeleteBody(req.body.deleteSession);
        if (!error){ // error will contain description of error, false if ok
          var bodyObj = req.body.deleteSession;
          var sId = bodyObj.sessId;
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
              res.status(401).send("error deleting session", err);
            })
          } else {
          console.log('jamSession:delete:error: ',error);
          res.status(400).send(error);
          }
      }
  })
  .all(function(req, res){
    res.status(404).send("Try using the POST method.")
  });

  // update a jam session -- NOT TESTED YET
  router.route('/update') 
    .post(function(req, res) {
      console.log('received update session POST');
      if(! req || !req.body || !req.body.updateSession) {
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
            res.status(401).send("error updating session", err);
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

  function checkDeleteBody(obj){
    if (!obj.hasOwnProperty('sessionId') || !(Number.isInteger(obj.sessionId))) {
      return "sessionId should be an integer value";
    }
    return false;
  }

  function getSessionById(sId){
    return new Promise(function(resolve,reject){
      // handle request for individual session-------------------
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
      function(err, results) {
        if (err){
          console.log("Error getting session data, id="+sId+", err:",err);
          reject(err);
        } else {
          console.log("putting it all together");  // results.queryone...
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
      //get sessions
      var sessions = "put actual sessions here";
      if(typeof sessions === "string") throw new Error("I wanted an object, thx.")
      if(!req.query) throw new Error("didn't get a query")

      return paginate(filterSessions(req.query, sessions), req.query.page);
    })
    .all(function(req, res){
      res.status(404).send("Try get method");
    })

  // session/search
  router.route('/search')
    .get(function(req, res){
      //get sessions
      var sessions = "put actual sessions here";
      if(typeof sessions === "string") throw new Error("I wanted an object, thx.")
      if(!req.query) throw new Error("didn't get a query")

      return paginate(filterSessions(req.query, sessions), req.query.page);
    })
    .all(function(req, res){
      res.status(404).send("Try get method");
    })


  function filterSessions(query, sessions){
    var currentList = sessions.slice();

    if(isValid(query.neededInstruments))
      currentList = currentList.filter(byArrayContainsMatch.bind(null, query.neededInstruments, "neededInstruments"))

    if(isValid(query.genre))
      currentList = currentList.filter(byExactMatch.bind(null, query.genre, "genre"))

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

  function valid(val){
    return val !== undefined && val !== ""
      ? true
      : false
  }


  return router;
}

