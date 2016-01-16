define([
  'app.js',
  'runtimes/services/serviceRootA.js'
], Ready(function(app) {
  app.controller('rootCtrl', [
    '$scope',
    function($scope) {
      $scope.location = 'rootCtrl';
    }
  ])
}));
