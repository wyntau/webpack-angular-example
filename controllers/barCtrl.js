module.exports = Promise.all([
  require('app'),
  require('styles/barCtrl.css'),
  require('services/serviceNormalB'),
  require('services/serviceNormalC')
]).then(function(ret){
  ret[0].controller('barCtrl', [
    '$scope',
    'serviceNormalB',
    'serviceNormalC',
    function($scope, serviceNormalB, serviceNormalC){
      $scope.location = 'barCtrl';
    }
  ])
})
