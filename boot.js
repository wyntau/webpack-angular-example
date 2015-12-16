module.exports = Promise.all([
  require('app.js'),
  require('runtimes/services/serviceRootA.js'),
  require('controllers/rootCtrl.js')
]).then(function() {
  angular.bootstrap(document, ['webpack-example']);
});
