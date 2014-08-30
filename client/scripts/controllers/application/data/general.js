angular.module('app').controller('ApplicationDataGeneralCtrl', function($scope) {

    $scope.namePattern = /^[а-яА-яІіЇї\-]+$/;

    $scope.isFormInvalid = function() {
        return $scope.forms.general.firstName.$invalid;
    };

    var fields = {
        'lastName': 'фамилия',
        'firstName': 'имя',
        'middleName': 'отчество',
        'gender': 'пол',
        'hasMilitaryId': 'наличие военного билета',
        'hasPrevPassport': 'наличие предыдущего загранпаспорта'
    };

    $scope.getMissingFields = function() {
        var result = [];
        for(var field in fields) {
            if (!$scope.application.general[field]) {
                if (field === 'hasMilitaryId' && $scope.application.general.gender !== 'male') continue;
                result.push(fields[field]);
            }
        }
        return result;
    };

});
