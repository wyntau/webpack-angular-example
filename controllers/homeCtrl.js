module.exports = Promise.all([
  require('app.js'),
  require('styles/homeCtrl.css'),
  require('services/serviceNormalA.js'),
  require('services/serviceNormalB.js')
]).then(function([app, ...args]){
  app.controller('homeCtrl', [
    '$scope',
    'serviceNormalA',
    'serviceNormalB',
    function($scope, serviceNormalA, serviceNormalB){
      $scope.location = 'homeCtrl';
    }
  ])
})
