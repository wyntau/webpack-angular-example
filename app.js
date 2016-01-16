
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
          deps: Chunk(function(resolve){
            require([
              'styles/rootCtrl.css',
              'controllers/rootCtrl'
            ], resolve);
          })
        }
      })
      .state('example.home', {
        url: '/',
        templateProvider: Chunk(function(resolve){
          require([
            'views/home.html',
            'styles/homeCtrl.css',
            'controllers/homeCtrl'
          ], resolve);
        }),
        controller: 'homeCtrl',
        resolve: {
          // deps: Chunk(function(resolve) {
          //   require([
          //     'controllers/homeCtrl'
          //   ], resolve);
          // })
        }
      })
      .state('example.foo', {
        url: '/foo',
        templateProvider: Chunk(function(resolve){
          require([
            'views/foo.html',
            'styles/fooCtrl.css',
            'controllers/fooCtrl'
          ], resolve);
        }),
        controller: 'fooCtrl',
        resolve: {
          // deps: Chunk(function(resolve) {
          //   require([
          //     'controllers/fooCtrl'
          //   ], resolve);
          // })
        }
      })
      .state('example.bar', {
        url: '/bar',
        templateProvider: Chunk(function(resolve){
          require([
            'views/bar.html',
            'styles/barCtrl.css',
            'controllers/barCtrl'
          ], resolve);
        }),
        controller: 'barCtrl',
        resolve: {
          // deps: Chunk(function(resolve) {
          //   require([
          //     'controllers/barCtrl'
          //   ], resolve);
          // })
        }
      })
  }
])
