angular.module('jamz.search-sessions', [])

  .controller('SearchSessionsCtrl', function ($scope, Search) {
    
    $scope.searchSessions = function () {
      $scope.answer = true;
      var check = true;

      if (check) {
        var genres = $scope.genres
          .split(',')
          .map(function(val) { return val.trim(); })
          .filter(function(val) {return val !== '' })

        var instruments = $scope.instruments
          .split(',')
          .map(function(val) { return val.trim() })
          .filter(function(val) { return val !== '' })
      }

        var session = {

        }
      Search.searchSessions(session)
      .then(function (data) {
        return data;
      })
    }

    $scope.searchUsers = function () {
      console.log("Like, whoa...man")
      Search.searchUsers(user)
      console.log("OKAY, I guess I'm working")
    }

  });


