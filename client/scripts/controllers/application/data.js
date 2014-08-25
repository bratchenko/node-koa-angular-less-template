angular.module('app').controller('ApplicationDataCtrl', function($scope, localStorageService, $state) {

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

    var dataGroups = {
        'intro': {
            id: 'intro',
            order: 0,
            title: 'Общая информация',
            isEnabled: function() {return true;},
            isValid: function() {
                return $scope.application.general.lastName &&
                    $scope.application.general.firstName &&
                    $scope.application.general.middleName &&
                    $scope.application.general.gender &&
                    ($scope.application.general.gender === 'female' ||
                         typeof $scope.application.general.hasMilitaryId === 'boolean') &&
                    typeof $scope.application.general.hasPrevPassport === 'boolean' &&
                    $scope.application.general.phoneNumber;
            }
        },
        'passport': {
            id: 'passport',
            order: 1,
            title: 'Внутренний паспорт',
            isEnabled: function() {return true;},
            isValid: function() {
                return $scope.application.passport.firstPage &&
                    $scope.application.passport.secondPage &&
                    $scope.application.passport.registrationPage;
            },
        },
        'tax-id': {
            id: 'tax-id',
            order: 2,
            title: 'Идентификационный код',
            isEnabled: function() {return true;},
            isValid: function() {
                return $scope.application.taxId.image || $scope.application.taxId.value;
            }
        },
        'photo': {
            id: 'photo',
            order: 3,
            title: 'Фотография',
            isEnabled: function() {return true;},
            isValid: function() {
                return $scope.application.photo.image;
            }
        },
        'military-id': {
            id: 'military-id',
            order: 4,
            title: 'Военный билет',
            isEnabled: function() {
                return $scope.application.general.gender === 'male' && $scope.application.general.hasMilitaryId;
            },
            isValid: function() {
                return $scope.application.militaryId.image;
            }
        },
        'military-registration': {
            id: 'military-registration',
            order: 5,
            title: 'Приписное свидетельство',
            isEnabled: function() {
                return $scope.application.general.gender === 'male' && !$scope.application.general.hasMilitaryId;
            },
            isValid: function() {
                return $scope.application.militaryRegistration.registration &&
                    $scope.application.militaryRegistration.certificate;
            }
        },
        'prev-passport': {
            id: 'prev-passport',
            order: 6,
            title: 'Предыдущий загранпаспорт',
            isEnabled: function() {
                return $scope.application.general.hasPrevPassport;
            },
            isValid: function() {
                return $scope.application.prevPassport.image || $scope.application.prevPassport.value;
            }
        }
    };

    $scope.getDataGroups = function() {
        var result = [];
        var foundFirstNotValid = false;
        for (var name in dataGroups) {
            var dataGroup = dataGroups[name];
            if (dataGroup.isEnabled()) {
                if (!dataGroup.isValid() && !foundFirstNotValid) {
                    foundFirstNotValid = true;
                    dataGroup.isOpen = true;
                }
                result.push(dataGroup);
            }
        }
        return result.sort(function(d1, d2) {
            return d1.order - d2.order;
        });
    };

    $scope.goToNextGroup = function(group) {
        group.isOpen = false;
        var groups = $scope.getDataGroups();
        var idx = groups.indexOf(group);
        var nextGroup = groups[idx+1];
        if (nextGroup) {
            nextGroup.isOpen = true;
        } else {
            $state.go('application.payment');
        }
    };

});
