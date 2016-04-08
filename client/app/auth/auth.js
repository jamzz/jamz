
angular.module("jamz.auth", [])

  .controller('AuthCtrl', function ($scope, $location, Auth) {
    $scope.user =  {}
    $scope.signup = function () {
      Auth.signup($scope.user)
      .then(function (user) {
        $location.path('/home');
        return user;
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    $scope.signin = function () {
      Auth.signin($scope.user)
      .then(function (user) {
        $location.path('/home');
        return user;
      })
      .catch(function (err) {
        console.error(err)
      })
    }

  });

