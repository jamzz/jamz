
angular.module("jamz.auth", [])

  .controller('AuthCtrl', function ($scope, $location, Auth) {
     $scope.user =  {}
    console.log("OLD MAN, I'M BEING STAGED")
    $scope.signup = function () {
    console.log("i've been called")
      Auth.signup($scope.user)
      .then(function (user) {
        // fill me in
        // $scope.user = user
        console.log("current user", user)
        $location.path('/home')
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    $scope.signin = function () {
      Auth.signin($scope.user)
      .then(function (user) {
        console.log("let's do this")
        $location.path('/home')
        // fill me in
      })
      .catch(function (err) {
        console.error(err)
      })
    }

  });

