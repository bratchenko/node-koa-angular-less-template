angular.module('app').controller('ApplicationDataPrevPassportCtrl', function($scope) {

    if (!$scope.application.prevPassport) {
        $scope.application.prevPassport = {};
    }

});
