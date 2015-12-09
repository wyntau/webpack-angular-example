define([
  'app',
  'style!css!styles/barCtrl',
  'services/serviceNormalB',
  'services/serviceNormalC'
], function(app){
  app.controller('barCtrl', [
    '$scope',
    'serviceNormalB',
    'serviceNormalC',
    function($scope, serviceNormalB, serviceNormalC){
      $scope.location = 'barCtrl';
    }
  ])
})
