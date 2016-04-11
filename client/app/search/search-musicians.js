angular.module('jamz.search-musicians', [])

  .controller('SearchMusiciansCtrl', function ($scope, Search) {
    
    $scope.searchMusicians = function () {

      var instruments = undefined;
      if ($scope.instruments){
        instruments = $scope.instruments
          .split(',')
          .map(function(val) { return val.trim() })
          .filter(function(val) { return val !== '' })
      }

      var user = {
        name: $scope.name,
        username: $scope.username,
        bands: $scope.band,
        instruments: instruments,
        page: 1
      }
      console.log("user to search", user);

      Search.searchUsers(user)
      .then(function (data) {
        $scope.users = data;
        return data;
      })
    }

  });