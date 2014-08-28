angular.module('app').controller('AdminApplicationsCtrl', function($scope, Application) {

    $scope.updateApplicationsList = function() {
        $scope.loadingData = true;
        $scope.applications = Application.query();
        $scope.applications.$promise.then(function() {
            $scope.loadingData = false;
        });
    };

    $scope.updateApplicationsList();


});
