(function () {

    angular.module('starter')
        .controller('ChatsCtrl', ChatsCtrl);


    ChatsCtrl.$inject = ['Users', 'User'];
    function ChatsCtrl(Users, User) {
        var self = this;
        self.users = Users.all();
        self.uid = User.data.uid;
    }

}());
