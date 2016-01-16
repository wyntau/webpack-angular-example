
window.Ready = function(cbk){
  return function(){
    return Promise.all([].slice.call(arguments)).then(function(args){
      if('function' == typeof cbk){
        cbk.apply(null, args);
      }
    });
  };
};

window.Chunk = function(loading){
  return function(){
    return new Promise(function(resolve, reject){
      loading(function(){
        Promise.all([].slice.call(arguments)).then(function(args){
          if(args.length){
            resolve(args[0]);
          }else{
            reject();
          }
        });
      });
    });
  };
};

define([
  'app.js',
  'controllers/rootCtrl.js'
], Ready(function(){
  angular.bootstrap(document, ['webpack-example']);
}));
