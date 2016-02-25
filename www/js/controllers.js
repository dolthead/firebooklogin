(function () {

    angular.module('starter.controllers', [])
        .controller('DashCtrl', DashCtrl)
        .controller('ChatsCtrl', ChatsCtrl)
        .controller('ChatDetailCtrl', ChatDetailCtrl)
        .controller('LoginCtrl', LoginCtrl)
        .controller('AccountCtrl', AccountCtrl);


    DashCtrl.$inject = ['DataService'];
    function DashCtrl(DataService) {
        var self = this;
        self.data = DataService.data;
        self.openWindow = openWindow;

        function openWindow(url) {
            // make sure you have this: cordova plugin add cordova-plugin-inappbrowser
            window.open(url, '_blank', 'location=yes');
            return false;
        }
    }

    ChatsCtrl.$inject = ['Chats'];
    function ChatsCtrl(Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        var self = this;
        self.chats = Chats.all();
        self.remove = function (chatId) {
            Chats.remove(chatId);
        };
    }

    ChatDetailCtrl.$inject = ['$stateParams', 'Chats'];
    function ChatDetailCtrl($stateParams, Chats) {
        var self = this;
        self.chat = Chats.get($stateParams.chatId);
    }

    AccountCtrl.$inject = ['DataService', '$state'];
    function AccountCtrl(DataService, $state) {
        var self = this;
        self.logout = logout;
        self.settings = {
            //enableFriends: true
        };

        function logout() {
            DataService.logout();
            $state.go('login');
        }
    }

    LoginCtrl.$inject = ['Auth', '$state', 'DataService', '$timeout', '$scope', '$ionicHistory'];
    function LoginCtrl(Auth, $state, DataService, $timeout, $scope, $ionicHistory) {
        var self = this;
        self.loginWith = loginWith;

        $scope.$on('$ionicView.loaded', function () {
            // if already logged in, go to first tab
            if (DataService.isLoggedIn()) {
                $ionicHistory.nextViewOptions({historyRoot: true});
                $state.go('tab.dash');
            }
        });

        function loginWith(provider) {
            Auth.$authWithOAuthPopup(provider)
                .then(function (authData) {
                    DataService.data[provider] = authData[provider];
                    $timeout(function () {
                        $state.go('tab.dash');
                    });
                });
        }

    }

}());
