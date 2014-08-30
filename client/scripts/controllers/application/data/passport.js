angular.module('app').controller('ApplicationDataPassportCtrl', function($scope, $upload, $http) {
    $scope.isDataValid = function() {
        return $scope.application.passport.firstPage &&
            $scope.application.passport.secondPage &&
            $scope.application.passport.registrationPage
    };

    var fields = {
        'firstPage': 'первая страница паспорта',
        'secondPage': 'вторая страница паспорта',
        'registrationPage': 'последняя страница регистрациии',
    };

    $scope.getMissingFields = function() {
        var result = [];
        for(var field in fields) {
            if (!$scope.application.passport[field]) {
                result.push(fields[field]);
            }
        }
        return result;
    };
});
