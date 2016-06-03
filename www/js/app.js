(function () {

    angular.module('starter', [
            'ionic',
            'firebase',
            'ngAnimate',
            'ngCordova'
        ])
        .constant('FirebaseUrl', 'https://<YOURFIREBASEHERE>.firebaseio.com/')
        .service('rootRef', ['FirebaseUrl', Firebase])
        .factory('Auth', Auth)
        .run(AppRun)
        .config(AppConfig);


    Auth.$inject = ['rootRef', '$firebaseAuth'];
    function Auth(rootRef, $firebaseAuth) {
        return $firebaseAuth(rootRef);
    }

    // used below for authentication enforcement in state definitions
    AuthDataResolver.$inject = ['Auth'];
    function AuthDataResolver(Auth) {
        return Auth.$requireAuth();
    }

    AppRun.$inject = ['$ionicPlatform', '$rootScope', '$state', 'User'];
    function AppRun($ionicPlatform, $rootScope, $state, User) {

        $ionicPlatform.ready(function () {

            //$timeout(function() { $cordovaSplashscreen.hide(); });

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
                    event.preventDefault(); // stop current execution
                    $state.go('login');
                }
            });

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (!User.isLoggedIn() && toState.name !== "login") {
                    event.preventDefault(); // stop current execution
                    $state.go('login'); // go to login
                }
            });

        });

    } // AppRun

    AppConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function AppConfig($stateProvider, $urlRouterProvider) {

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

            // Each tab has its own nav history stack
            .state('tab.welcome', {
                url: '/welcome',
                cache: false,
                views: {
                    'tab-welcome': {
                        templateUrl: 'templates/tab-welcome.html',
                        controller: 'WelcomeCtrl as ctrl'
                    }
                }
            })

            .state('tab.chats', {
                url: '/chats',
                cache: false,
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl as ctrl'
                    }
                }
            })

            .state('tab.chat-detail', {
                url: '/chats/:uid',
                cache: false,
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl as ctrl'
                    }
                }
            })

            .state('tab.settings', {
                url: '/settings',
                views: {
                    'tab-settings': {
                        templateUrl: 'templates/tab-settings.html',
                        controller: 'SettingsCtrl as ctrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    } // AppConfig

}());
