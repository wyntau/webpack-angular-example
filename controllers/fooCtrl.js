define([
  'app.js',
  'services/serviceNormalA.js',
  'services/serviceNormalC.js'
], Ready(function(app) {
  app.controller('fooCtrl', [
    '$scope',
    'serviceNormalA',
    'serviceNormalC',
    function($scope, serviceNormalA, serviceNormalC) {
      $scope.location = 'fooCtrl';
    }
  ])
}))
