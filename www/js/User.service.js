(function () {

    angular.module('starter')
        .service('User', User);


    User.$inject = ['rootRef', 'Auth'];
    function User(rootRef, Auth) {
        
        var self = this;
        self.data = {};
        self.updateUser = updateUser;
        self.logout = logout;
        self.isLoggedIn = isLoggedIn;

        // load auth data

        rootRef.onAuth(function(authData) {
            if (authData) {
                self.data = angular.merge(self.data, authData);
                console.log(self.data);
                rootRef.child('users').child(authData.uid).update({
                    lastActive: Firebase.ServerValue.TIMESTAMP
                });
            } else {
                //console.log("Client unauthenticated.")
            }
        });

        // public functions

        function updateUser(authData) {
            return rootRef.child('users').child(authData.uid).set({
                uid: authData.uid,
                name: authData[authData.provider].displayName,
                imgUrl: authData[authData.provider].profileImageURL,
                lastLogin: Firebase.ServerValue.TIMESTAMP,
                lastActive: Firebase.ServerValue.TIMESTAMP
            });
        }

        function logout() {
            // rootRef.unauth();
            Auth.$unauth();
        }

        function isLoggedIn() {
            return self.data.facebook || self.data.google || self.data.twitter;
        }
    }

}());
