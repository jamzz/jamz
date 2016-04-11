angular.module("jamz.services", [])

  .factory('Sessions', function ($http){

    var Sessions = [];
    // get current jam sessions
    var getSessions = function () {
      return $http({
        method: 'GET',
        url: '/session'
      })
      .then(function (resp){
        return resp.data
      })
      .catch(function(err) {
        console.error(err);
      })
    };

    var logout = function(){
      return $http({
        method: 'POST',
        url: '/auth/logout'
      })
    }

    var joinSesh = function (jamId, sessionId) {
      return $http({
        method:'POST',
        url: 'session/join?sessionId='+sessionId, 
        data: {
          jamSessionId: jamId
        }
      })
      .catch(function (err) {
        console.error(err)
      })
    }
    return {
      getSessions: getSessions,
      logout: logout, 
      joinSesh: joinSesh
    }
  })

  .factory('Users', function ($http) {

    var Users = [];
    // get current users
    var getUsers = function () {
      return $http({
        method: 'GET',
        url: '/user'
      })
      .then(function (resp) {
        return resp.data;
      })
      .catch(function (err) {
        console.error(err);
      })
    };

    return {
      getUsers: getUsers
    }

  })


  .factory('Dash', function ($http) {
    // create a new session
    var createSession = function (data, SID) {
      return $http({
        method: 'POST',
        url: '/session/create',
        data: {
          newSession: data
        }
      })
      .then(function (resp) {
        return resp.data
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    var getMySessions = function (sessionId) {
      return $http({
        method: 'GET',
        url: '/session?sessionId='+sessionId,
      })
      .then(function (resp) {
        return resp.data
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    var editSession = function (data) {
      return $http({
        method: 'PUT',
        url: '/SampleUpdateSession',
        data: data
      })
      .then(function (resp) {
        return resp.data
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    return {
      createSession: createSession,
      getMySessions: getMySessions,
      editSession: editSession
    }

  })

  .factory('Profile', function ($http) {
    // what is this doing?
    var getUserData = function (user) {
      return user.data;
    }

    var Profile = []
    // get user profile
    var getProfile = function () {
      console.log("Trying boss!!")
      return $http({
        method: 'GET',
        url: '/user'
      })
      .then(function (data) {
        return data.data
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    var editProfile = function (profile) {
      console.log("gonna edit this fool")
      return $http({
        method: 'PUT',
        url: 'user/',
        data: profile
      })
      .then(function (resp) {
        console.log("edited profile: ", resp)
      })
      .catch(function (err) {
        console.error(err);
      })
    }

    return {
      getProfile: getProfile,
      editProfile: editProfile
    }

  })

  .factory('Auth', function ($http) {
  // allow users to sign up
  var user = {}

    var signup = function (user) {
      console.log("trying to signup..")
      return $http({
        method: 'POST', 
        url: 'auth/signup', 
        data: user
      })
      .then(function (resp) {
        console.log("new user data: ", resp)
        return resp.data
      })
      .catch(function (err) {
        console.error(err)
      })
  }

  // allow user to sign in
    var signin = function (user) {
      console.log("signing in..")
      return $http({
        method: 'POST', 
        url: 'auth/login', 
        data: user
      })
      .then(function (resp) {
        return resp.data
      })
      .catch(function (err) {
        console.error(err)
      })
    }
      return {
        signup: signup,
        signin: signin
      }

  })

  .factory('Search', function ($http) {


    var searchSessions = function (data) {
      return $http({
        method: 'GET', 
        url: '/session/search', 
        data: data
      })
      .then(function (resp) {
        console.log("resp.data in search sesh", resp.data);
        return resp.data
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    var searchUsers = function (data) {
      return $http({
        method: 'GET', 
        url: '/user/search',
        data: data
      })
      .then(function (resp) {
        return resp.data
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    return {
      searchSessions: searchSessions,
      searchUsers: searchUsers
    }
  })





