(function () {

    angular.module('starter.services', [])
        .factory('Auth', Auth)
        .service('DataService', DataService)
        .factory('Chats', Chats);


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

        rootRef.onAuth(function(authData) {
            if (authData) {
                //console.log("Authenticated with uid:", authData.uid);
                //console.log(ds.data);
                ds.data = angular.merge(ds.data, authData);
            } else {
                //console.log("Client unauthenticated.")
            }
        });

        function logout() {
            rootRef.unauth();
        }

        function isLoggedIn() {
            return ds.data.facebook || ds.data.google || ds.data.twitter;
        }
    }

    function Chats() {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'img/ben.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'img/max.png'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'img/adam.jpg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'img/perry.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'img/mike.png'
        }];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    }

}());
