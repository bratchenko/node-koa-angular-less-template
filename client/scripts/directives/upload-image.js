angular.module('app').directive('uploadImage', function($modal) {

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
                uploadFile(files[0]);
            };

            $scope.remove = function() {
                $scope.ngModel = null;
            };

            $scope.takeWebcamPicture = function() {
                $modal.open({
                    templateUrl: '/views/take-photo-popup.html',
                    controller: 'TakePhotoPopupCtrl',
                }).result.then(function(photoData) {
                    if (photoData) {
                        var blob = dataURItoBlob(photoData);
                        uploadFile(blob, 'photo.png');
                    }
                });
            };

            function dataURItoBlob(dataURI) {
                var byteString = atob(dataURI.split(',')[1]);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                return new Blob([ab], { type: 'image/png'});
            }

            function uploadFile(file, fileName) {
                console.log(file);
                $scope.isFileUploading = true;
                $scope.uploadProgress = 0;

                $http.get('/s3/policy')
                    .then(function(response) {
                        var s3Credentials = response.data;

                        if (!fileName) {
                            fileName = file.name;
                        }
                        var fileExtension = fileName.split('.').pop() || ".jpg";
                        var mimeType = file.type || "image/jpeg";
                        var filename = "uploads/" + Date.now() + Math.round(Math.random() * 1000000) +  "." + fileExtension;
                        var url = 'https://passport-application.s3-eu-west-1.amazonaws.com/' + filename;

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
                    })
                    .catch(function(response) {
                        $scope.isFileUploading = false;
                        window.alert(response.data);
                    });
            }
        }
    };

});
