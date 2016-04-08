angular.module('jamz.home', [])

  .controller('MainCtrl', function ($scope, Sessions) {


    $scope.getSessions = function(){
      Sessions.getSessions()
        .then(function(data){
          $scope.sessions = data;
          console.log("data", data)
        })
        .catch(function(err){
          console.error(err);
        })
    }

    $scope.getSessions();
  });
