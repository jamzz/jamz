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
    }

    return {
      getSessions: getSessions
    }

  })

  .factory('Users', function($http) {

    var Users = [];


    return {

    }

  })
