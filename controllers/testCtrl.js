define([
  'app.js',
  'libs/test.js'
], Ready(function(app){
  app.controller('testCtrl', [
    'testService',
    function(testService){
      testService.run();
    }
  ])
}))
