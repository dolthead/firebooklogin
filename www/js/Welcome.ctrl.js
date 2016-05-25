(function () {

    angular.module('starter')
        .controller('WelcomeCtrl', WelcomeCtrl);


    WelcomeCtrl.$inject = ['User', '$cordovaSocialSharing'];
    function WelcomeCtrl(User, $cordovaSocialSharing) {

        var self = this;
        self.data = User.data;
        self.share = share;
        self.openGoogleWindow = openGoogleWindow;
        self.openFacebookWindow = openFacebookWindow;
        self.openTwitterWindow = openTwitterWindow;

        // public functions

        function share() {
            var message = 'Firechat with me (' + User.data[User.data.provider].displayName + ')';
            var subject = 'Firechat app/website';
            var file = 'img/icon-small@3x.png';
            var link = 'https://firebooklogin.firebaseio.com';
            if (window.cordova) {
                $cordovaSocialSharing.share(message, subject, file, link)
                    .then(function (result) {
                        console.log('shared');
                    }, function (err) {
                        console.log('not shared');
                    });
            }
            else {
                console.log('no cordova');
            }
        }

        function openGoogleWindow() {
            openWindow(self.data.google.cachedUserProfile.link);
        }

        function openFacebookWindow() {
            openWindow(self.data.facebook.cachedUserProfile.link);
        }

        function openTwitterWindow() {
            openWindow('https://twitter.com/' + self.data.twitter.username);
        }

        // private functions

        function openWindow(url) {
            // make sure you have installed this plugin: ionic plugin add cordova-plugin-inappbrowser
            window.open(url, '_blank', 'location=yes');
            return false;
        }
        
    }

}());
