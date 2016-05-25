(function () {

    angular.module('starter')
        .factory('Users', Users);


    Users.$inject = ['rootRef', '$firebaseArray'];
    function Users(rootRef, $firebaseArray) {

        var users = $firebaseArray(rootRef.child('users'));

        // public interface

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

}());
