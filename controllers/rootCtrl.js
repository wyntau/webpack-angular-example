module.exports = Promise.all([
  require('app.js'),
  require('styles/rootCtrl.css'),
  require('runtimes/services/serviceRootA.js')
]).then(function([app, ...args]){
  app.controller('rootCtrl', [
    '$scope',
    function($scope){
      $scope.location = 'rootCtrl';
    }
  ])
})
