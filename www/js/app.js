(function () {

  angular.module('starter', [
      'ionic',
      'starter.controllers',
      'starter.services',
      'firebase',
      'ngAnimate'
    ])
    .constant('FirebaseUrl', 'https://firebooklogin.firebaseio.com/')
    .service('rootRef', ['FirebaseUrl', Firebase])
    .run(AppRun)
    .config(AppConfig);


  // used below for authentication enforcement in state definitions
  AuthDataResolver.$inject = ['Auth'];
  function AuthDataResolver(Auth) {
    return Auth.$requireAuth();
  }

  AppRun.$inject = ['$ionicPlatform', '$rootScope', '$state', 'DataService'];
  function AppRun($ionicPlatform, $rootScope, $state, DataService) {

    $ionicPlatform.ready(function () {

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      // set up state handlers for authentication enforcement
      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        if (error === 'AUTH_REQUIRED') {
          e.preventDefault(); // stop current execution
          $state.go('login');
        }
      });

      $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
        if (!DataService.data.facebook && !DataService.data.google && toState.name !== "login") {
          e.preventDefault(); // stop current execution
          $state.go('login'); // go to login
        }
      });

    });

  } // AppRun

  AppConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  function AppConfig($stateProvider, $urlRouterProvider) {

    //$localStorageProvider.setKeyPrefix('');

    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl as ctrl'
      })

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        resolve: {
          authData: AuthDataResolver
        }
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl as ctrl'
          }
        }
      })

      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl as ctrl'
          }
        }
      })

      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl as ctrl'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl as ctrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  } // AppConfig

}());
