angular.module('app').controller('LoginByPhoneCtrl', function($scope, $rootScope, $http, $timeout) {

    $scope.credentials = {};

    $scope.requestPin = function() {
        $scope.pinRequested = true;
    };

    $scope.changePhone = function() {
        $scope.pinRequested = false;
    };

    $scope.logIn = function() {
        $http.post('/api/login', $scope.credentials).then(function(response) {
            $rootScope.alert = {
                type: 'success',
                message: 'Ваш телефон теперь привязан к вашей заявке!'
            };
            $rootScope.currentUser = response.data;
            $timeout(function() {
                $rootScope.alert = null;
            }, 3000);
        }).catch(function(response) {
            $scope.loginError = response.data.error;
        });
    };

});
