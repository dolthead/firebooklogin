(function () {

    angular.module('starter')
        .controller('SettingsCtrl', SettingsCtrl);


    SettingsCtrl.$inject = ['User', '$state'];
    function SettingsCtrl(User, $state) {
        var self = this;
        self.logout = logout;
        self.settings = {
            //enableFriends: true
        };

        function logout() {
            User.logout();
            $state.go('login');
        }
    }


}());
