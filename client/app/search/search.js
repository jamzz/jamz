angular.module('jamz.search', [])

  .controller('SearchCtrl', function ($scope, Search) {
    $scope.musicianSearchCollapsed = true;
    $scope.sessionSearchCollapsed  = true;
  });