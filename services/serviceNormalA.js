module.exports = Pending(function(resolve){
  define([
    'app.js'
  ], resolve);
}, function(app){
  app.factory('serviceNormalA', function(){
    return 'serviceNormalA';
  });
});
