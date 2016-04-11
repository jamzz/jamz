angular.module("jamz.profile", [])

  .controller("ProfileCtrl", function ($scope, Profile) {
    $scope.editState = false;


    $scope.getProfile = function () {
      Profile.getProfile()
      .then(function (data) {
        console.log("I Look like this", data[0])
        $scope.profile = data[0];
        $scope.newInstruments = $scope.profile.instruments.join(', ');
        $scope.newBands = $scope.profile.bands.join(', ');
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    $scope.editProfile = function () {
      $scope.editState = true;
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
