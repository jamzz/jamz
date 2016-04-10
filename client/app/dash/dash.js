angular.module('jamz.dash', [])

  .controller('DashCtrl', function ($scope, $cookies, Dash) {
    $scope.createCollapsed = true;

    var mySessionId = $cookies.get('sessionId');
    $scope.getMySessions = function(){
      Dash.getMySessions(mySessionId)
        .then(function(data){
          console.log("data in getMySessions", data)
          $scope.sessions = data;
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
