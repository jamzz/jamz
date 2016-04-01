angular.module('jamz.home', [])

  .controller('MainCtrl', function ($scope, Sessions) {
    // $scope.session = "HII!!"
    // $scope.sessionTwo = "Hello!!"

    $scope.getSessions = function(){
      Sessions.getSessions()
        .then(function(data){
          $scope.sessions = data.data;
          console.log("data", data.data)
        })
        .catch(function(err){
          console.error(err);
        })
    }

    $scope.getSessions();
  });
