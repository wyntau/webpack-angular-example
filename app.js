define(Ready(function(){

var app = angular.module('webpack-example', [
  'ui.router'
]);

app.config([
  '$controllerProvider',
  '$compileProvider',
  '$filterProvider',
  '$provide',
  '$injector',
  function($controllerProvider, $compileProvider, $filterProvider, $provide, $injector) {
    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.provider = $provide.provider;
    app.value = $provide.value;
    app.constant = $provide.constant;
    app.decorator = $provide.decorator;

    window.Library = (function(){

      var providers = {
        '$controllerProvider': $controllerProvider,
        '$compileProvider': $compileProvider,
        '$filterProvider': $filterProvider,
        '$provide': $provide
      };

      var cache = {};

      return function Library(module){

        // already activated
        if(cache[module]){
          return;
        }

        var module = angular.module(module);

        var i;

        if (module.requires) {
          for (i = 0; i < module.requires.length; i++) {
            Library(module.requires[i]);
          }
        }

        var invokeArgs, provider, method, args;
        for(i = 0; i < module._invokeQueue.length; i++){
          invokeArgs = module._invokeQueue[i];
          provider = providers[invokeArgs[0]];
          method = invokeArgs[1];
          args = invokeArgs[2];
          provider[method].apply(provider, args);
        }

        for(i = 0; i < module._configBlocks.length; i++){
          $injector.invoke(module._configBlocks[i]);
        }

        for(i = 0; i < module._runBlocks.length; i++){
          $injector.invoke(module._runBlocks[i]);
        }

        cache[module] = true;
      };
    })();
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
      .state('example.test', {
        url: '/test',
        templateProvider: Chunk(function(resolve){
          require([
            'views/test.html',
            'controllers/testCtrl.js'
          ], resolve)
        }),
        controller: 'testCtrl'
      })
  }
])

return app;

}))
