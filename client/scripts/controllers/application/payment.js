angular.module('app').controller('ApplicationPaymentCtrl', function($scope, $state, applicationService) {

    $scope.isSaving = false;
    $scope.next = function() {
        if ($scope.isSaving) {
            return;
        }
        $scope.isSaving = true;
        applicationService.update($scope.application)
            .then(function() {
                $scope.isSaving = false;
                $state.go('application.nextAction');
            })
            .catch(function(response) {
                $scope.isSaving = false;
                console.error(response);
                window.alert(JSON.stringify(response.data));
            });
    };

});
