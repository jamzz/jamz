angular.module('jamz.dash-create', [])

  .controller('CreateCtrl', function ($scope, $cookies, Dash) {

    $scope.amount = 0;

    $scope.expOptions = [
      {
        name: 'Any',
        value: 'any'
      },
      {
        name: 'Novice',
        value: 'novice'
      },
      {
        name: 'Intermediate',
        value: 'intermediate'
      },
      {
        name: 'Advanced',
        value: 'advanced'
      },
      {
        name: 'Professional',
        value: 'professional'
      }
    ];

    $scope.experience = $scope.expOptions[0];

    $scope.createSession = function() {
      // var check = confirm("Are you sure you want to create this session?");
      var check = true;

      if (check) {
        var genres = $scope.genres
          .split(',')
          .map(function(val){ return val.trim(); })
          .filter(function(val){ return val !== '' })
          .join(', ')
          .trim();

          console.log("genres", genres)

        var instruments = $scope.instruments
          .split(',')
          .map(function(val){ return val.trim(); })
          .filter(function(val){ return val !== '' });

        var SID = $cookies.get('sessionId');

        // not handling arrays yet
        var session = {
          title: $scope.title,
          description: $scope.description,
          genre: genres,
          paidAmount: $scope.amount,
          experience: $scope.experience.value,
          needInstruments: instruments,
          area: $scope.city,
          location: $scope.location,
          musicians: [],
          date: $scope.date.toDateString(), // does this belong here?
          time: $scope.time.toLocaleString('en-US', {hour12: true}) // does this belong here?
        };

        console.log("session to be created:", session);

        Dash.createSession(session, SID)
        .then(function(data){
          //reset data when successfully created
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
