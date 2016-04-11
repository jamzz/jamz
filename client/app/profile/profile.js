angular.module("jamz.profile", [])

  .controller("ProfileCtrl", function ($scope, Profile) {
    $scope.editState = false;


    $scope.getProfile = function () {
      
      Profile.getProfile()
      .then(function (data) {
        console.log("I Look like this", data[0])
        $scope.profile = data[0];
        $scope.profile.instruments = $scope.profile.instruments.join(', ');
        $scope.profile.bands = $scope.profile.bands.join(', ');
      })
      .catch(function (err) {
        console.error(err)
      })
    }

    $scope.editProfile = function () {
      $scope.editState = true;
    }

    $scope.saveProfile = function() {
      if ($scope.profile.bands){
        $scope.profile.bands = $scope.profile.bands
          .split(',')
          .map(function(val){ return val.trim(); })
          .filter(function(val){ return val !== '' })
      }

      if ($scope.profile.instruments){
        $scope.profile.instruments = $scope.profile.instruments
          .split(',')
          .map(function(val){ return val.trim(); })
          .filter(function(val){ return val !== '' })
      }

      var newProfile = {
        id: $scope.profile.id
        username: $scope.profile.username,
        name: $scope.profile.name,
        contactEmail: $scope.profile.contactEmail,
        contactPhone: $scope.profile.contactPhone,
        instruments: $scope.profile.instruments,
        experience: $scope.profile.experience,
        bands: $scope.profile.bands,
        description: $scope.profile.description,
        picture: $scope.profile.picture
      }

      console.log("new profile:", newProfile);

      Profile.editProfile(newProfile)
        .then(function (data) {
          $scope.getProfile();
          $scope.editState = false;
        })
        .catch(function (err) {
          console.error(err)
        })
    }

    $scope.getProfile();
  });
