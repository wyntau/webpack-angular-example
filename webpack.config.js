var path = require('path')

  , webpack = require('webpack')

  , ReplaceTaskWebpackPlugin = require('replace-task-webpack-plugin')
  , htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  resolve: {
    root: [
      path.resolve(__dirname)
    ]
  },
  entry: {
    boot: 'boot.js',
    vendor: [
      'bower_components/promiz/promiz.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js'
    ]
  },
  output: {
    path: 'dist',
    publicPath: '/dist/',
    filename: '[name].js',
    pathinfo: false
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
    , new ReplaceTaskWebpackPlugin({
      patterns: [{
        match: 'foo',
        replacement: 'foo+bar'
      }]
    })
    , new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
    // , new htmlWebpackPlugin({
    //   filename: '../index.html',
    //   template: 'index.temp.html'
    // })
  ],
  module: {
    loaders: [
      {
        test: /services\/.*/,
        exclude: /runtimes\/[^\/]*\/.*/,
        loader: 'then?global,[name]'
      },
      {
        test: /\.css$/,
        loader: 'style'
      },
      {
        test: /\.css$/,
        loader: 'css',
        query: {
          minimize: true
        }
      },
      {
        test: /\.css$/,
        loader: 'autoprefixer',
        query: {
          browsers: ['> 1%']
        }
      },
      {
        test: /\.html$/,
        loader: 'raw!html-minifier'
      }
    ]
  },
  'html-minifier-loader': {
    collapseWhitespace: true,
    removeComments: true
  }
}
