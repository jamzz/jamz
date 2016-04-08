angular.module('jamz.search-sessions', [])

  .controller('SearchSessionsCtrl', function ($scope, Search) {
    
    $scope.paid = false;
    $scope.searchSessions = function () {

      var genres = undefined;
      if ($scope.genres) {
        genres = $scope.genres
          .split(',')
          .map(function(val) { return val.trim(); })
          .filter(function(val) {return val !== '' })
      }

      var instruments = undefined;
      if ($scope.instruments) {
        instruments = $scope.instruments
          .split(',')
          .map(function(val) { return val.trim() })
          .filter(function(val) { return val !== '' })
      }

      var session = {
        title: $scope.title,
        genre: genres,
        paidAmount: $scope.paid, // new field
        // experience: $scope.experience,
        neededInstruments: instruments,
        area: $scope.city,
        page: 1
      };

      console.log("session to search", session);

      Search.searchSessions(session)
      .then(function (data) {
        return data;
      })
    }

    $scope.searchUsers = function () {
      Search.searchUsers(user)
    }

  });


