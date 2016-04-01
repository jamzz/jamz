angular.module('jamz.users', [])

  .controller('UsersCtrl', function ($scope, $location) {
    $scope.user = {}

    $scope.searchUsers = function () {
      Users.searchUsers()
      .then(function () {

      })
    }
  })
