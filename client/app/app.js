angular.module('jamz', [
    'jamz.home',
    'jamz.users',
    'jamz.profile',
    'jamz.services',
    'ui.router'
  ])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

    .state('home', {
      url: '/home',
      templateUrl: 'app/home/home.html',
      controller: 'MainCtrl'
    })

    .state('profile',  {
      url: '/profile',
      templateUrl: 'app/profile/profile.html',
      controller: 'ProfileCtrl'
    })



});

console.log('help')
