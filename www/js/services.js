(function () {

    angular.module('starter.services', [])
        .factory('Users', Users)
        .factory('Auth', Auth)
        .service('DataService', DataService)
        .factory('Chats', Chats);


    Users.$inject = ['rootRef', '$firebaseArray'];
    function Users(rootRef, $firebaseArray) {
        var users = $firebaseArray(rootRef.child('users'));

        var Users = {
            get: function(uid){
                return users.$getRecord(uid);
            },
            all: function() {
                return users;
            }
        };

        return Users;
    }


    Auth.$inject = ['rootRef', '$firebaseAuth'];
    function Auth(rootRef, $firebaseAuth) {
        return $firebaseAuth(rootRef);
    }


    DataService.$inject = ['rootRef'];
    function DataService(rootRef) {
        var ds = this;
        ds.data = {};
        ds.logout = logout;
        ds.isLoggedIn = isLoggedIn;
        ds.storeUser = storeUser;

        rootRef.onAuth(function(authData) {
            if (authData) {
                ds.data = angular.merge(ds.data, authData);
                console.log(ds.data);
                rootRef.child('users').child(authData.uid).update({
                    lastActive: Firebase.ServerValue.TIMESTAMP
                });
            } else {
                //console.log("Client unauthenticated.")
            }
        });

        function storeUser(authData) {
            rootRef.child('users').child(authData.uid).set({
                uid: authData.uid,
                name: authData[authData.provider].displayName,
                imgUrl: authData[authData.provider].profileImageURL,
                lastLogin: Firebase.ServerValue.TIMESTAMP,
                lastActive: Firebase.ServerValue.TIMESTAMP
            });
        }

        function logout() {
            rootRef.unauth();
        }

        function isLoggedIn() {
            return ds.data.facebook || ds.data.google || ds.data.twitter;
        }
    }


    Chats.$inject = ['$firebaseArray', 'rootRef'];
    function Chats($firebaseArray, rootRef) {

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
