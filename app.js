define(Ready(function(){

var app = angular.module('webpack-example', [
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
              'controllers/rootCtrl.js'
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
            'controllers/homeCtrl.js'
          ], resolve);
        }),
        controller: 'homeCtrl'
      })
      .state('example.foo', {
        url: '/foo',
        templateProvider: Chunk(function(resolve){
          require([
            'views/foo.html',
            'styles/fooCtrl.css',
            'controllers/fooCtrl.js'
          ], resolve);
        }),
        controller: 'fooCtrl'
      })
      .state('example.bar', {
        url: '/bar',
        templateProvider: Chunk(function(resolve){
          require([
            'views/bar.html',
            'styles/barCtrl.css',
            'controllers/barCtrl.js'
          ], resolve);
        }),
        controller: 'barCtrl'
      })
  }
])

return app;

}))
