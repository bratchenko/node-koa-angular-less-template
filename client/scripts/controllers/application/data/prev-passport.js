angular.module('app').controller('ApplicationDataPrevPassportCtrl', function($scope) {

    if (!$scope.application.prevPassport) {
        $scope.application.prevPassport = {};
    }

    $scope.valuePattern = /^\w{2}\s*\d{6}$/g;

});
