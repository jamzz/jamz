angular.module("jamz.services", [])

  .factory('Sessions', function ($http){

    var Sessions = [];
    // get current jam sessions
    var getSessions = function () {
      return $http({
        method: 'GET',
        url: '/session'
      })
      .then(function (data){
        console.log("data.data: ", data.data);
        return data.data
      })
      .catch(function(err) {
        console.error(err);
      })
    };

    return {
      getSessions: getSessions
    }
  })

  .factory('Users', function ($http) {

    var Users = [];
    // get current users
    var getUsers = function () {
      console.log("trying to work")
      return $http({
        method: 'GET',
        url: '/user'
      })
      .then(function (data) {
        console.log("heres your data", data);
        return data.data;
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
    var createSession = function (data) {
      return $http({
        method: 'POST',
        url: '/session/create',
        data: {
          newSession: data
        }
      })
      .then(function (data){
        console.log("data returned from createSession:", data);
      })
      .catch(function (err){
        console.log("err", err);
      })
    }

    return {
      createSession: createSession
    }
  })

  .factory('Profile', function ($http) {

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

    var editProfile = function () {
      console.log("gonna edit this fool")
      return $http({
        method: 'PUT',
        url: 'user/:id',
        data: {
          editedProfile: data
        }
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
    var signin = function ($http) {
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

  var searchSessions = function () {
    return $http({
      method: 'GET', 
      url: '/session/search', 
      data: {
        // fill me in 
      }
    })
    .then(function (resp) {
      return resp.data
    })
    .catch(function (err) {
      console.error(err)
    })

  }

  var searchUsers = function () {
    return $http({
      method: 'GET', 
      url: '/user/search',
      data: {
        // fill me in  
      }
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





