angular.module('app').service('applicationService', function($http) {

    this.update = function(data) {
        return $http.post('/api/application', data);
    };

    this.get = function() {
        return $http.get('/api/application')
            .then(function(response) {
                return response.data;
            })
            .catch(function() {
                return null;
            });
    };

});
