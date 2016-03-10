require.config({
  baseUrl: './',
  shim: {
    'bower_components/test/test.js': {
      deps: []
    }
  }
})

require(['boot.js'])
