define([
  'app',
  'style!css!styles/homeCtrl.css',
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
