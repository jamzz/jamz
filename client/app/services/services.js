angular.module("jamz.services", [])

  .factory('Sessions', function($http){

    var Sessions = [];

    var getSessions = function () {
      return $http({
        method: 'GET',
        url: '/sampleSeshData'
      })
      .then(function(data){
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
