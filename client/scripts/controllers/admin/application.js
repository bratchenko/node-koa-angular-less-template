angular.module('app').controller('AdminApplicationCtrl', function($scope, application, $state) {

    $scope.application = application;

    $scope.declineData = {};

    $scope.approve = function() {
        application.status = 'approved';
        application.$save().then(function() {
            $state.go('admin.applications');
        });
    };

    $scope.decline = function() {
        application.status = 'declined';
        application.$save().then(function() {
            $state.go('admin.applications');
        });
    };

});
