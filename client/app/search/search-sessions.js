angular.module('jamz.search-sessions', [])

  .controller('SearchSessionsCtrl', function ($scope, Search) {
    
    $scope.paid = false;

    $scope.expOptions = [
      {
        name: 'No Filter',
        value: undefined
      },
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
        paidAmount: $scope.paid,
        experience: $scope.experience.value,
        neededInstruments: instruments,
        area: $scope.city,
        // musician: undefined, // not really sure we need this
        page: 1
      };

      console.log('session to search:', session);

      Search.searchSessions(session)
      .then(function (data) {
        return data;
      })
    }
  });


