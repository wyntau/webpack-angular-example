define([
  'app.js',
  'styles/homeCtrl.css',
  'services/serviceNormalA.js',
  'services/serviceNormalB.js'
], Ready(function(app) {
  app.controller('homeCtrl', [
    '$scope',
    'serviceNormalA',
    'serviceNormalB',
    function($scope, serviceNormalA, serviceNormalB) {
      $scope.location = 'homeCtrl';
    }
  ])
}))
