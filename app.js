var app = module.exports = angular.module('webpack-example', [
  'ui.router'
]);

app.config([
  '$controllerProvider',
  '$compileProvider',
  '$filterProvider',
  '$provide',
  function($controllerProvider, $compileProvider, $filterProvider, $provide) {
    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.provider = $provide.provider;
    app.value = $provide.value;
    app.constant = $provide.constant;
    app.decorator = $provide.decorator;
  }
]);

var Loading = function(loading, callback){
  return function(){
    return Pending(loading, callback);
  }
}

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

    // $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/example/');

    $stateProvider
      .state('example', {
        abstract: true,
        url: '/example',
        template: '<div ui-view></div>',
        controller: 'rootCtrl',
        resolve: {
          deps: Loading(function(resolve){
            require([
              'controllers/rootCtrl'
            ], resolve);
          })
        }
      })
      .state('example.home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'homeCtrl',
        resolve: {
          deps: Loading(function(resolve) {
            require([
              'controllers/homeCtrl'
            ], resolve);
          })
        }
      })
      .state('example.foo', {
        url: '/foo',
        templateUrl: 'views/foo.html',
        controller: 'fooCtrl',
        resolve: {
          deps: Loading(function(resolve) {
            require([
              'controllers/fooCtrl'
            ], resolve);
          })
        }
      })
      .state('example.bar', {
        url: '/bar',
        templateUrl: 'views/bar.html',
        controller: 'barCtrl',
        resolve: {
          deps: Loading(function(resolve) {
            require([
              'controllers/barCtrl'
            ], resolve);
          })
        }
      })
  }
])
