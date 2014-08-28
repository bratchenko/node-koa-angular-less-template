angular.module('app').factory('Application', function($resource) {
    return $resource('/api/admin/applications/:id', {
        id: '@_id'
    });
});
