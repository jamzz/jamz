angular.module('jamz.home', [])

  .controller('MainCtrl', function ($scope, $location, $cookies, Sessions) {

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

    $scope.joinSesh = function() {
      var jamId = this.session.id;
      var sessionId = $cookies.get('sessionId');
      Sessions.joinSesh(jamId, sessionId)
      .then(function (data) {
        $scope.getSessions();
        return data;
      })
      .catch(function (err) {
        console.error(err)
      })

    }

    $scope.logout = function(){
      Sessions.logout()
        .then(function(data){
          $location.path("/signup")
          return data
        })
        .catch(function(err){
          console.error(err);
        })
    }

    $scope.getSessions();
  });
