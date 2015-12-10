module.exports = Promise.all([
  require('app'),
  require('styles/fooCtrl.css'),
  require('services/serviceNormalA'),
  require('services/serviceNormalC')
]).then(function(ret){
  ret[0].controller('fooCtrl', [
    '$scope',
    'serviceNormalA',
    'serviceNormalC',
    function($scope, serviceNormalA, serviceNormalC){
      $scope.location = 'fooCtrl';
    }
  ])
})
