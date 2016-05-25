(function () {

    angular.module('starter')
        .service('User', User);


    User.$inject = ['rootRef'];
    function User(rootRef) {
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

}());
