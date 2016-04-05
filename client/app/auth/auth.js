
angular.module("jamz.auth", [])

  .controller('AuthCtrl', function ($scope, Auth) {
    // $scope.user =  {}

    $scope.signup = function () {
      Auth.signup()
      .then(function (user) {
        // fill me in
        $scope.user = user
        console.log("current user", user)
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    $scope.signin = function () {
      Auth.signin()
      .then(function (user) {
        console.log("let's do this")
        // fill me in
      })
      .catch(function (err) {
        console.error(err)
      })
    }

  });
