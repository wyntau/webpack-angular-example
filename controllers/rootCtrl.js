module.exports = Promise.all([
  require('app'),
  require('style!css!styles/rootCtrl.css'),
  require('runtimes/services/serviceRootA')
]).then(function(ret){
  ret[0].controller('rootCtrl', [
    '$scope',
    function($scope){
      $scope.location = 'rootCtrl';
    }
  ])
})
