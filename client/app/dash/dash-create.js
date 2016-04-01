angular.module('jamz.dash-create', [])

  .controller('CreateCtrl', function($scope, Dash) {
    $scope.instrumentsNeeded = [];
    $scope.genres = [];

    $scope.createSession = function() {
      var check = ("Are you sure you want to create this session?");

      if (check) {
        var genres = $scope.genres
          .split(',')
          .map(function(val){ return val.trim(); })
        var instruments = $scope.instruments
          .split(',')
          .map(function(val){ return val.trim(); })

        var session = {
          title: $scope.title,
          description: $scope.description,
          genres: genres,
          paidAmount: $scope.amount,
          experience: $scope.experience,
          instrumentsNeeded: instruments,
          area: $scope.city,
          location: $scope.location,
          date: $scope.date,
          time: $scope.time
        };

        console.log("session to be created:", session);

      }
    }

  })
