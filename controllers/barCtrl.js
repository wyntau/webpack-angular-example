define([
  'app.js',
  'styles/barCtrl.css',
  'services/serviceNormalB.js',
  'services/serviceNormalC.js'
], Ready(function(app) {
  app.controller('barCtrl', [
    '$scope',
    'serviceNormalB',
    'serviceNormalC',
    function($scope, serviceNormalB, serviceNormalC) {
      $scope.location = 'barCtrl';
    }
  ])
}));
