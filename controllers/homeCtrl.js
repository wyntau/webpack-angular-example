
module.exports = Pending(function(resolve){
  define([
    'app.js',
    'styles/homeCtrl.css',
    'services/serviceNormalA.js',
    'services/serviceNormalB.js'
  ], resolve);
}, function(app){
  app.controller('homeCtrl', [
    '$scope',
    'serviceNormalA',
    'serviceNormalB',
    function($scope, serviceNormalA, serviceNormalB){
      $scope.location = 'homeCtrl';
    }
  ])
})
