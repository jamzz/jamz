angular.module('jamz.dash', [])

  .controller('DashCtrl', function ($scope, Dash) {
    $scope.createCollapsed = true;

    $scope.getMySessions = function(){
      Dash.getMySessions()
        .then(function(data){
          console.log("data in getMySessions", data.data)
          $scope.sessions = data.data;
        })
        .catch(function(err){
          console.error(err);
        })
    }

    $scope.editSession = function() {
      // Dash.editSession()

    }

    $scope.getMySessions();
  });
