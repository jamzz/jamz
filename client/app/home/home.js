angular.module('jamz.home', [])

  .controller('MainCtrl', function ($scope, $location, Sessions) {

    $scope.getSessions = function(){
      Sessions.getSessions()
        .then(function(data){
          $scope.sessions = data;
          console.log("data in get sessions", data)
        })
        .catch(function(err){
          console.error(err);
        })
    }

    $scope.logout = function(){
      Sessions.logout()
        .then(function(data){
          return data
        })
        .catch(function(err){
          console.error(err);
        })
    }

    $scope.getSessions();
  });
