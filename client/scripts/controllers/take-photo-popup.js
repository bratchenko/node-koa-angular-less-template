angular.module('app').controller('TakePhotoPopupCtrl', function($scope, $modalInstance) {

    var video;

    $scope.onAccessDenied = function() {
        $scope.cameraError = "Не удалось получить доступ к веб-камере";
    };

    function syncWithAngular(callback) {
        if (!$scope.$$phase) {
            $scope.$apply(callback);
        } else {
            callback();
        }
    }

    $scope.onCameraReady = function(videoElem) {
        video = videoElem;
        syncWithAngular(function() {
            $scope.isCameraReady = true;
        });
    };

    $scope.makeSnapshot = function() {
        console.log("Make snapshot!", video);
        if (video) {
            $scope.imageDataUrl = getImageDataUrl();
        }
    };

    $scope.cancelSnapshot = function() {
        $scope.imageDataUrl = null;
    };

    $scope.save = function() {
        $modalInstance.close($scope.imageDataUrl);
    };

    $scope.close = function() {
        $modalInstance.close();
    };

    function getImageDataUrl() {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = video.width;
        hiddenCanvas.height = video.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(video, 0, 0, video.width, video.height);
        // ctx.getImageData(0, 0, video.width, video.height);
        return hiddenCanvas.toDataURL();
    }

});
