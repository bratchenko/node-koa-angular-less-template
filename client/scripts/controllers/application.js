angular.module('app').controller('ApplicationCtrl', function($scope, $state, localStorageService) {
    var defaultApplication = {
        general: {
            hasTaxId: true
        },
        passport: {},
        taxId: {},
        photo: {},
        militaryId: {},
        militaryRegistration: {},
        prevPassport: {}
    };

    $scope.application = localStorageService.get('application');
    if (!$scope.application) {
        $scope.application = defaultApplication;
    }

    $scope.$watch('application', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            localStorageService.set('application', newValue);
        }
    }, true);


    $scope.$state = $state;
});
