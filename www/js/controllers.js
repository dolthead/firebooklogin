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


    ChatsCtrl.$inject = ['Users', 'DataService'];
    function ChatsCtrl(Users, DataService) {
        var self = this;
        self.users = Users.all();
        self.uid = DataService.data.uid;
    }


    ChatDetailCtrl.$inject = ['$scope', '$stateParams', 'Chats', 'Users', 'DataService'];
    function ChatDetailCtrl($scope, $stateParams, Chats, Users, DataService) {
        var self = this;
        self.newMessage = '';
        self.fromUid = DataService.data.uid;
        self.toUid = $stateParams.uid;
        self.fromUser = Users.get(self.fromUid);
        self.toUser = Users.get(self.toUid);
        self.chats = Chats.get(self.fromUid, self.toUid);
        self.keyUp = keyUp;
        self.send = send;
        self.getImageURL = getImageURL;


        $scope.$on('$ionicView.beforeEnter', function () {
            Chats.reset();
        });

        function getImageURL(uid) {
            return (uid == self.fromUid ? self.fromUser.imgUrl : self.toUser.imgUrl);
        }

        function send() {
            if (self.newMessage.trim()) {
                console.log(self.newMessage);
                Chats.add(self.newMessage, self.fromUid, self.toUid).then(function(){
                    clear();
                });
            }
        }

        function keyUp(keyEvent) {
            if (keyEvent.keyCode == 13)
            {
                self.send();
            }
            else if (keyEvent.keyCode == 27)
            {
                clear();
            }
        }
        function clear() {
            self.newMessage = '';
        }
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
                    DataService.storeUser(authData);
                    $timeout(function () {
                        $state.go('tab.dash');
                    });
                });
        }

    }

}());
