define([
  'app',
  'style!css!styles/rootCtrl.css',
  'services/serviceRootA'
], function(app){
  app.controller('rootCtrl', [
    '$scope',
    function($scope){
      $scope.location = 'rootCtrl';
    }
  ])
})
