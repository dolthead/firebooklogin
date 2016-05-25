(function () {

    angular.module('starter')
        .controller('LoginCtrl', LoginCtrl);


    LoginCtrl.$inject = ['Auth', '$state', 'User', '$timeout', '$scope', '$ionicHistory'];
    function LoginCtrl(Auth, $state, User, $timeout, $scope, $ionicHistory) {
        var self = this;
        self.loginWith = loginWith;

        $scope.$on('$ionicView.loaded', function () {
            // if already logged in, go to first tab
            if (User.isLoggedIn()) {
                $ionicHistory.nextViewOptions({historyRoot: true});
                $state.go('tab.welcome');
            }
        });

        function loginWith(provider) {
            Auth.$authWithOAuthPopup(provider)
                .then(function (authData) {
                    User.data[provider] = authData[provider];
                    User.storeUser(authData);
                    $timeout(function () {
                        $state.go('tab.welcome');
                    });
                });
        }

    }

}());
