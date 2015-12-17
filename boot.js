
window.Pending = function(loading, callback) {
  return new Promise(function(resolve, reject){
    loading(function(){
      Promise.all([].slice.call(arguments)).then(function(args){
        if('function' == typeof callback){
          callback.apply(null, args);
        }
        resolve();
      }, reject);
    });
  });
};

module.exports = Pending(function(resolve){
  define([
    'app.js',
    'controllers/rootCtrl.js'
  ], resolve);
}, function(){
  angular.bootstrap(document, ['webpack-example']);
});
