angular.module('jamz.dash-create', [])

  .controller('CreateCtrl', function($scope, Dash) {

    $scope.amount = 0;

    $scope.createSession = function() {
      // var check = confirm("Are you sure you want to create this session?");
      var check = true;

      if (check) {
        var genres = $scope.genres
          .split(',')
          .map(function(val){ return val.trim(); })
          .filter(function(val){ return val !== '' });
        var instruments = $scope.instruments
          .split(',')
          .map(function(val){ return val.trim(); })
          .filter(function(val){ return val !== '' });

        var session = {
          sessionId: 1,
          title: $scope.title,
          description: $scope.description,
          // genres: genres,
          paidAmount: $scope.amount,
          experience: $scope.experience,
          // instrumentsNeeded: instruments,
          area: $scope.city,
          location: $scope.location,
          date: $scope.date,
          time: $scope.time
        };

        Dash.createSession(session)
        .then(function(data){
          $scope.title = '';
          $scope.description = '';
          $scope.genres = [];
          $scope.amount = 0;
          $scope.experience = '';
          $scope.instruments = [];
          $scope.city = '';
          $scope.location = '';
          $scope.date = '';
          $scope.time = '';
          return data;
        })
      }
    }

  })
