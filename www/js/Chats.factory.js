(function () {

    angular.module('starter')
        .factory('Chats', Chats);
    

    Chats.$inject = ['$firebaseArray', 'rootRef', '$ionicScrollDelegate'];
    function Chats($firebaseArray, rootRef, $ionicScrollDelegate) {

        var self = this;
        self.fromUid = undefined;
        self.toUid = undefined;
        self.combinedUids = undefined;  // sorted slash-delimited list of users: 'user1/user2'
        self.chats = undefined;


        function combineUids(fromUid, toUid) {
            return (fromUid < toUid ? fromUid + '/' + toUid : toUid + '/' + fromUid);
        }


        function init(fromUid, toUid) {
            self.fromUid = fromUid;
            self.toUid = toUid;
            self.combinedUids = combineUids(fromUid, toUid);
            self.chats = $firebaseArray(rootRef.child('chats/' + self.combinedUids));
            self.chats.$watch(function(){
                $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom();
            });
        }

        return {
            lastMessage: function(fromUid, toUid) {

            },
            reset: function() {
                self.combinedUids = undefined;
            },
            add: function(message, fromUid, toUid) {
                if (!self.combinedUids) {
                    init(fromUid, toUid);
                }
                var chat = {
                    fromUid: fromUid,
                    message: message,
                    timestamp: Firebase.ServerValue.TIMESTAMP
                };
                return self.chats.$add(chat);
            },
            get: function(fromUid, toUid) {
                if (!self.combinedUids) {
                    init(fromUid, toUid);
                }
                return self.chats;
            },
            all: function () {
                //return self.chats;
            },
            remove: function (chat) {
                //chats.splice(chats.indexOf(chat), 1);
            }
        };
    }

}());
