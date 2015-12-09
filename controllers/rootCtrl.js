define([
  'app',
  'style!css!styles/rootCtrl'
  'services/serviceRootA'
], function(app){
  app.controller('rootCtrl', [
    '$scope',
    function($scope){
      $scope.location = 'rootCtrl';
    }
  ])
})
