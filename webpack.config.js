var path = require('path')

  , webpack = require('webpack')

module.exports = {
  resolve: {
    root: [
      path.resolve(__dirname)
    ]
  },
  entry: {
    main: path.resolve(__dirname, 'main.js')
  },
  output: {
    path: 'dist',
    publicPath: '/dist/',
    filename: '[name].js',
    pathinfo: true
  },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //       warnings: false
  //     }
  //   })
  // ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel?presets[]=es2015'
      },
      {
        test: /services\/.*/,
        exclude: /runtimes\/[^\/]*\/.*/,
        loader: 'then?global,[name]'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  }
}
