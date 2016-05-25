(function () {

    angular.module('starter')
        .controller('ChatDetailCtrl', ChatDetailCtrl);


    ChatDetailCtrl.$inject = ['$scope', '$stateParams', 'Chats', 'Users', 'User', '$ionicScrollDelegate'];
    function ChatDetailCtrl($scope, $stateParams, Chats, Users, User, $ionicScrollDelegate) {
        
        var self = this;
        self.newMessage = '';
        self.fromUid = User.data.uid;
        self.toUid = $stateParams.uid;
        self.fromUser = Users.get(self.fromUid);
        self.toUser = Users.get(self.toUid);
        self.chats = Chats.get(self.fromUid, self.toUid);
        self.getImageURL = getImageURL;
        self.send = send;
        self.keyUp = keyUp;

        // initialization

        $scope.$on('$ionicView.beforeEnter', function () {
            Chats.reset();
            $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom();
        });

        // public functions

        function getImageURL(uid) {
            return (uid == self.fromUid ? self.fromUser.imgUrl : self.toUser.imgUrl);
        }

        function send() {
            if (self.newMessage.trim()) {
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

        // private functions

        function clear() {
            self.newMessage = '';
        }
    }


}());
