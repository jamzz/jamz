
angular.module("jamz.auth", [])

  .controller('AuthCtrl', function ($scope, Auth) {
    // $scope.user =  {}
    console.log("OLD MAN LOOK AT MY LIFE")
    $scope.signup = function () {
        console.log("i've been called")
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

