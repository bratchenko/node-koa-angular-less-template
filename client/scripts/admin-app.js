angular.module('app', [
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'angularFileUpload'
])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('admin', {
            abstract: true,
            url: "/admin",
            template: "<div ui-view></div>"
        })
        .state('admin.applications', {
            url: "/applications",
            controller: 'AdminApplicationsCtrl',
            templateUrl: '/views/admin/applications.html'
        })
        .state('admin.application', {
            url: "/applications/:id",
            controller: 'AdminApplicationCtrl',
            templateUrl: '/views/admin/application.html',
            resolve: {
                application: function(Application, $stateParams) {
                    return Application.get({id: $stateParams.id});
                }
            }
        })
        ;

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/admin/applications");
})

.run(function(USER, $rootScope) {
    $rootScope.currentUser = USER;
});
