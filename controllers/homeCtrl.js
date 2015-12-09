define([
  'app',
  'style!css!styles/homeCtrl',
  'services/serviceNormalA',
  'services/serviceNormalB'
], function(app){
  app.controller('homeCtrl', [
    '$scope',
    'serviceNormalA',
    'serviceNormalB',
    function($scope, serviceNormalA, serviceNormalB){
      $scope.location = 'homeCtrl';
    }
  ])
})
