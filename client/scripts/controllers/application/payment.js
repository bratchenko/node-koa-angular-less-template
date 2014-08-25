angular.module('app').controller('ApplicationPaymentCtrl', function($scope, $state) {

    $scope.next = function() {
        $state.go('application.nextAction');
    };

});
