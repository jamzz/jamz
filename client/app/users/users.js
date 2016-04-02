angular.module('jamz.users', [])

  .controller('UsersCtrl', function ($scope, $location, Users) {

    $scope.getUsers = function () {
      console.log("ive been called")
      Users.getUsers()
      .then(function (data) {
        $scope.users = data;
      })
      .catch(function(err) {
        console.error(err);
      })
    }
    $scope.getUsers();
  })
