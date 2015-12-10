module.exports = Promise.all([
  require('app'),
  require('style!css!styles/homeCtrl.css'),
  require('services/serviceNormalA'),
  require('services/serviceNormalB')
]).then(function(ret){
  ret[0].controller('homeCtrl', [
    '$scope',
    'serviceNormalA',
    'serviceNormalB',
    function($scope, serviceNormalA, serviceNormalB){
      $scope.location = 'homeCtrl';
    }
  ])
})
