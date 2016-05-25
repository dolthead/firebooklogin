(function () {

    angular.module('starter')
        .controller('SettingsCtrl', SettingsCtrl);


    SettingsCtrl.$inject = ['User', '$state'];
    function SettingsCtrl(User, $state) {
        
        var self = this;
        self.settings = {
            //enableFriends: true
        };
        self.logout = logout;

        // public functions

        function logout() {
            User.logout();
            $state.go('login');
        }
    }

}());
