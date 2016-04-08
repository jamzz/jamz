angular.module('jamz.show-search', [])

  .controller('ShowSearchCtrl', function ($scope, Search) {
    console.log("Boogie Time!!")
    
    $scope.searchSessions = function () {
      console.log("Far OUT")
      Search.searchSessions(session)
      console.log("I think I'm working")

    }

    $scope.searchUsers = function () {
      console.log("Like, whoa...man")
      Search.searchUsers(user)
      console.log("OKAY, I guess I'm working")
    }

  });


