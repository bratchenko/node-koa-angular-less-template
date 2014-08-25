angular.module('app').directive('uploadImage', function() {

    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            title: '='
        },
        templateUrl: '/views/directives/upload-image.html',
        controller: function($scope, $http, $upload) {
            $scope.onFileSelect = function(files) {
                if (files.length === 0) {
                    return;
                }
                $http.get('/s3/policy')
                    .then(function(response) {
                        var s3Credentials = response.data;
                        uploadFile(files[0], s3Credentials);
                    })
                    .catch(function(response) {
                        window.alert(response.data);
                    });
            };

            $scope.remove = function() {
                $scope.ngModel = null;
            };

            function uploadFile(file, s3Credentials) {
                var fileExtension = file.name.split('.').pop() || ".jpg";
                var mimeType = file.type || "image/jpeg";
                var filename = "uploads/" + Date.now() + Math.round(Math.random() * 1000000) +  "." + fileExtension;
                var url = 'https://passport-application.s3-eu-west-1.amazonaws.com/' + filename;

                $scope.isFileUploading = true;
                $scope.uploadProgress = 0;

                $scope.upload = $upload.upload({
                    scope: $scope,
                    url: 'https://passport-application.s3-eu-west-1.amazonaws.com/',
                    method: 'POST',
                    data: {
                        key: filename,
                        AWSAccessKeyId: s3Credentials.key,
                        acl: "public-read",
                        policy: s3Credentials.policy,
                        signature: s3Credentials.signature,
                        'Content-Type': mimeType
                    },
                    file: file
                }).progress(function(evt) {
                    $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function() {
                    $scope.isFileUploading = false;
                    $scope.uploadProgress = 100;
                    $scope.ngModel = url;
                }).error(function(err) {
                    window.alert(err);
                });
            }
        }
    };

});
