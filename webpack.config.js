var fs = require('fs')
  , path = require('path')

  , webpack = require('webpack')

module.exports = {
  resolve: {
    root: [
      path.resolve(__dirname)
    ]
  },
  entry: {
    app: [path.resolve(__dirname, 'app.js')]
  },
  output: {
    path: 'dist',
    publicPath: '/dist/',
    filename: '[name].js',
    pathinfo: true
  },
  module: {
    loaders: [
      {
        test: /services\/.*/,
        exclude: /runtimes\/[^\/]*\/.*/,
        loader: 'then?global,[name]'
      }
    ]
  }
}
