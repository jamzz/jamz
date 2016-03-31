angular.module("routerApp", [
    "ui.router",
    "ui.bootstrap"
  ])

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    // .state('home', {
    //   url: '/',
    //   templateUrl: 'home/home.html',
    //   controller: 'MainCtrl'
    // })

    // .state('profile',  {
    //   url: '/profile',
    //   templateUrl: 'profile/profile.html',
    //   controller: 'ProfileCtrl'
    // })
})
