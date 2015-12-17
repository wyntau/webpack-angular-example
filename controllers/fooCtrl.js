
module.exports = Pending(function(resolve){
  define([
    'app.js',
    'styles/fooCtrl.css',
    'services/serviceNormalA.js',
    'services/serviceNormalC.js'
  ], resolve);
}, function(app){
  app.controller('fooCtrl', [
    '$scope',
    'serviceNormalA',
    'serviceNormalC',
    function($scope, serviceNormalA, serviceNormalC){
      $scope.location = 'fooCtrl';
    }
  ])
})
