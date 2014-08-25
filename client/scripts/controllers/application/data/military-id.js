angular.module('app').controller('ApplicationDataMilitaryIdCtrl', function($scope) {

    if (!$scope.application.militaryId) {
        $scope.application.militaryId = {};
    }

});
