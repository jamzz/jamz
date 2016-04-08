angular.module("jamz.profile", [])

  .controller("ProfileCtrl", function ($scope, Profile) {

    $scope.getProfile = function () {
      console.log("HEY!!")
      Profile.getProfile()
      .then(function (data) {
        console.log("I Look like this", data[0])
        $scope.profile = data[0];
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    $scope.editProfile = function () {
      console.log("you want to edit a profile")
      Profile.editProfile()
      .then(function (data) {
        console.log("tried to edit profile")
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    $scope.getProfile();
  });
