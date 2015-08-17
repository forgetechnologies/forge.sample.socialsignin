angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope,ngFB,$window,$rootScope,TwitterLib) {
  // $scope.playlists = [
  //   { title: 'Reggae', id: 1 },
  //   { title: 'Chill', id: 2 },
  //   { title: 'Dubstep', id: 3 },
  //   { title: 'Indie', id: 4 },
  //   { title: 'Rap', id: 5 },
  //   { title: 'Cowbell', id: 6 }
  // ];
  $scope.fbLogin = function () {
    ngFB.login({scope: 'email, user_about_me, user_birthday, user_hometown, user_website'}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                $scope.closeLogin();
                ngFB.api({
                    path: '/me',
                    params: {fields: 'id,name'}
                }).then(
                    function (user) {
                        $rootScope.User = user;
                        $rootScope.User.ProfileImageBase64 = "http://graph.facebook.com/"+$rootScope.User.id+"/picture?width=270&height=270";
                        // alert(JSON.stringify($rootScope.User));
                        $window.location = "#/app/browse"
                    },
                    function (error) {
                        alert('Facebook error: ' + error.error_description);
                    });
                // $window.location = "#/app/browse"

            } else {
                alert('Facebook login failed');
            }
        });
};
$scope.doLogin = function (){
  TwitterLib.init().then(function (_data) {
      console.log(JSON.stringify(_data));
      $rootScope.User=_data;
     $window.location = "#/app/browse"
  }, function error(_error) {
      alert(JSON.stringify(_error));
  });
};

})

.controller('BrowserController', function($scope, $stateParams,$rootScope) {
  $scope.share = function (event) {
    ngFB.api({
        method: 'POST',
        path: '/me/feed',
        params: {
            message: "I'll be attending: '" + $scope.session.title + "' by " +
            $scope.session.speaker
        }
    }).then(
        function () {
            alert('The session was shared on Facebook');
        },
        function () {
            alert('An error occurred while sharing this session on Facebook');
        });
};
});
