angular.module('app').controller('ApplicationDataPassportCtrl', function($scope, $upload, $http) {
    $scope.isDataValid = function() {
        return $scope.application.passport.firstPage &&
            $scope.application.passport.secondPage &&
            $scope.application.passport.registrationPage
    };
});
