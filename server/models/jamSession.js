//This function is invoked immediately and gets express passed in from server.js
var knex = require('../db')

module.exports = function(express) {

  var router = express.Router();

  // requests for jam session data
  router.route('/')
    .get(function(req, res){
      console.log('---received sessions GET, query='+JSON.stringify(req.query));
      var rq = req.query;
      if (rq && rq.id) {
        // handle request for individual session-------------------
        knex('session').where({
          id: rq.id
        }).select('*')
        .then(function(data){
          console.log("jamSession:request for sessionId "+rq.id+" successful. Returning: "+data[0]);
          res.status(200).send(data[0]);
        })
        .catch(function(error){
          console.log("jamSession:request for sessionId "+rq.id+" failed. Error: "+error);
          res.status(400).send("Could not find requested sessionId ("+rq.id+")");
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
    } else if (!obj.hasOwnProperty('genre') || (typeof obj.location !== 'string')) {
      return "genre should be a string value";
    } else if (!obj.hasOwnProperty('description') || (typeof obj.description !== 'string')) {
      return "description should be a string value";
    } else if (!obj.hasOwnProperty('experience') || (typeof obj.experience   !== 'string')) {
      return "experience should be a string value";
    } else if (!obj.hasOwnProperty('needInstruments') || (!Array.isArray(obj.needInstruments))) {
      return "neededInstruments should be an array of string values"; // TODO: check contents of these arrays
    } else if (!obj.hasOwnProperty('musicians') || (!Array.isArray(obj.musicians))) {
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

  return router;
}

