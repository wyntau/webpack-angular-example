define([
  'app.js',
  'styles/rootCtrl.css',
  'runtimes/services/serviceRootA.js'
], Ready(function(app) {
  app.controller('rootCtrl', [
    '$scope',
    function($scope) {
      $scope.location = 'rootCtrl';
    }
  ])
}));
