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
    main: path.resolve(__dirname, 'main.js'),
    app: ['app'],
    service_serviceRootA: ['services/serviceRootA'],
    service_serviceNormalA: ['services/serviceNormalA'],
    service_serviceNormalB: ['services/serviceNormalB'],
    service_serviceNormalC: ['services/serviceNormalC']
  },
  output: {
    path: 'dist',
    publicPath: '/dist/',
    filename: '[name].js',
    pathinfo: true
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: [
        'services/serviceRootA',
        'services/serviceNormalA',
        'services/serviceNormalB',
        'services/serviceNormalC'
      ],
      minChunks: Infinity
    })
  ]
}
