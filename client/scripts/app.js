angular.module('app', [
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'angularFileUpload',
    'LocalStorageModule'
])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('index', {
            url: "/",
            controller: 'IndexCtrl',
            templateUrl: '/views/index.html'
        })
        .state('application', {
            url: "/application",
            controller: 'ApplicationCtrl',
            templateUrl: '/views/application.html',
            abstract: true
        })
        .state('application.data', {
            url: "",
            controller: 'ApplicationDataCtrl',
            templateUrl: '/views/application/data.html'
        })
        .state('application.payment', {
            url: "/payment",
            controller: 'ApplicationPaymentCtrl',
            templateUrl: '/views/application/payment.html'
        })
        .state('application.nextAction', {
            url: "/next-action",
            controller: 'ApplicationNextActionCtrl',
            templateUrl: '/views/application/next-action.html'
        })
        .state('status', {
            url: "/status",
            controller: 'StatusCtrl',
            templateUrl: '/views/status.html'
        });

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");
})

.run(function(USER, $rootScope) {
    $rootScope.currentUser = USER;
});
