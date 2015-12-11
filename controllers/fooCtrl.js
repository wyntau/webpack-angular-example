module.exports = Promise.all([
  require('app.js'),
  require('styles/fooCtrl.css'),
  require('services/serviceNormalA.js'),
  require('services/serviceNormalC.js')
]).then(function([app, ...args]){
  app.controller('fooCtrl', [
    '$scope',
    'serviceNormalA',
    'serviceNormalC',
    function($scope, serviceNormalA, serviceNormalC){
      $scope.location = 'fooCtrl';
    }
  ])
})
