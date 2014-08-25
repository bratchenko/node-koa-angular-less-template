angular.module('app').controller('ApplicationDataMilitaryRegistrationCtrl', function($scope) {

    if (!$scope.application.militaryRegistration) {
        $scope.application.militaryRegistration = {};
    }

});
