module.exports = Promise.all([
  require('app.js'),
  require('styles/barCtrl.css'),
  require('services/serviceNormalB.js'),
  require('services/serviceNormalC.js')
]).then(function([app, ...args]){
  app.controller('barCtrl', [
    '$scope',
    'serviceNormalB',
    'serviceNormalC',
    function($scope, serviceNormalB, serviceNormalC){
      $scope.location = 'barCtrl';
    }
  ])
})
