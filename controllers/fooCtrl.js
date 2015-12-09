define([
  'app',
  'style!css!styles/fooCtrl',
  'services/serviceNormalA',
  'services/serviceNormalC'
], function(app){
  app.controller('fooCtrl', [
    '$scope',
    'serviceNormalA',
    'serviceNormalC',
    function($scope, serviceNormalA, serviceNormalC){
      $scope.location = 'fooCtrl';
    }
  ])
})
