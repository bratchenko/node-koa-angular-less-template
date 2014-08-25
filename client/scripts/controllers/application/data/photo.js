angular.module('app').controller('ApplicationDataPhotoCtrl', function($scope) {

    if (!$scope.application.photo) {
        $scope.application.photo = {};
    }

});
