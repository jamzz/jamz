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
        url: '/sampleUserData'
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

    var Profile = []
    // get user profile
    var getProfile = function () {
      console.log("Trying boss!!")
      return $http({
        method: 'GET',
        url: 'sampleUserData'
      })
      .then(function (data) {
        return data.data
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    return {
      getProfile: getProfile
    }

  })

.factory('Auth', function ($http) {
  // allow users to sign up
  var signup = function (data) {
    console.log("trying to signup..")
    return $http({
      method: 'POST', 
      url: 'auth/signup', 
      data: {
        User: data
      }
    })
    .then(function (data) {
      console.log("new user data: ", data)
    })
    .catch(function (err) {
      console.error(err)
    })
  }
  // allow user to sign in
  var signin = function ($http) {
    console.log("signing in..")
    return $http({
      method: 'GET', 
      url: 'auth/login'
    })
    .then(function (user) {
      return user.data
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

// .factory('Edit', function ($http) {

//   var editUser = function (data) {
//     return $http({
//       method: 'POST', 
//       url: 'user/:id'
//       data: {
//         user: data
//       }
//     })
//   }
// })




