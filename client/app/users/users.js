angular.module('jamz.users', [])

  .controller('UsersCtrl', function ($scope, $location) {
    $scope.user = {}

    $scope.getUsers = function () {
      Users.getUsers()
      .then(function (data) {
        $scope.da
      })
    }
  })
