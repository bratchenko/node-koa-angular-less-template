angular.module('app', [
    'ngResource',
    'ui.router',
    'ui.bootstrap'
])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('index', {
            url: "/",
            controller: 'IndexCtrl',
            templateUrl: '/views/index.html'
        });

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");
})

.run(function(USER, $rootScope) {
    $rootScope.currentUser = USER;
});
