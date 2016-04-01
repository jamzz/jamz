angular.module('jamz', [
    'jamz.home',
    'jamz.users',
    'jamz.profile',
    'jamz.services',
    'jamz.dash',
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

    .state('profile', {
      url: '/profile',
      templateUrl: 'app/profile/profile.html',
      controller: 'ProfileCtrl'
    })

    .state('users', {
      url: '/users',
      templateUrl: 'app/users/users.html',
      controller: 'UsersCtrl'
    })

    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'app/dash/dash.html',
      controller: 'DashCtrl'
    })



});

console.log('help')
