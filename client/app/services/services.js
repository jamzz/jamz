angular.module("jamz.services", [])

  .factory('Sessions', function($http){

    var Sessions = [];
    // TODO: add comments
    var getSessions = function () {
      return $http({
        method: 'GET',
        url: '/session'
      })
      .then(function(data){
        console.log("data.data: ", data.data)
        return data.data
      })
      .catch(function(err) {
        console.error(err)
      })
    };

    return {
      getSessions: getSessions
    }
  })

  .factory('Users', function($http) {

    var Users = [];

    var getUsers = function () {
      console.log("trying to work")
      return $http({
        method: 'GET',
        url: '/sampleUserData'
      })
      .then(function(data) {
        console.log("heres your data", data)
        return data.data;
      })
      .catch(function(err) {
        console.error(err);
      })
    };

    return {
      getUsers: getUsers
    }

  })


  .factory('Dash', function($http) {

    return {

    }
  })

  .factory('Profile', function ($http) {

    var Profile = []

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






