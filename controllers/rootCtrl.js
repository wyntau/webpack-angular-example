
module.exports = Pending(function(resolve){
  define([
    'app.js',
    'styles/rootCtrl.css',
    'runtimes/services/serviceRootA.js'
  ], resolve);
}, function(app){
  app.controller('rootCtrl', [
    '$scope',
    function($scope){
      $scope.location = 'rootCtrl';
    }
  ])
});
