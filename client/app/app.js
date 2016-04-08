angular.module('jamz', [
  'jamz.auth',
  'jamz.home',
  'jamz.users',
  'jamz.profile',
  'jamz.services',
  'jamz.dash',
  'jamz.dash-create',
  'jamz.search', 
  'jamz.show-search',
  'ngAnimate',
  'ui.bootstrap',
  'ui.router'
  ])

.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');

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
    views: {
      '': {
        templateUrl: 'app/dash/dash.html',
        controller: 'DashCtrl'
      },
      'create@dashboard': {
        templateUrl: 'app/dash/dash-create.html',
        controller: 'CreateCtrl'
      }
    }
  })

  .state('signup', {
    url: '/signup', 
    templateUrl: 'app/auth/signup.html', 
    controller: 'AuthCtrl'
  })

  .state('signin', {
    url: '/signin', 
    templateUrl: 'app/auth/signin.html', 
    controller: 'AuthCtrl'
  })

  .state('search', {
    url: '/search', 
    views: {
      '': {
        templateUrl: '../index.html',
        controller: 'SearchCtrl'
      },
      'search@search': {
        templateUrl: 'app/search/show-search.html',
        controller: 'ShowSearchCtrl'
      }
    }
  })

});

// console.log('help')
