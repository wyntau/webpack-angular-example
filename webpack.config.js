
var path = require('path')

  , pkg = require('./package.json')

  , webpack = require('webpack')

  , autoprefixer = require('autoprefixer')

  , ReplaceTaskWebpackPlugin = require('replace-task-webpack-plugin')
  , htmlWebpackPlugin = require('html-webpack-plugin')
  , WriteFilePlugin = require('write-file-webpack-plugin')

var webpackConfig = module.exports = {}

webpackConfig.resolve = {
  root: path.resolve(__dirname)
};

//// entry config
webpackConfig.entry = {
  boot: ['boot.js']
};
// add vendor
webpackConfig.entry.vendor = [
  'bower_components/promiz/promiz.js',
  'bower_components/angular/angular.js',
  'bower_components/angular-ui-router/release/angular-ui-router.js'
];
webpackConfig.devServer = {
  contentBase: './',
  port: 6200,
  host: 'localhost',
  outputPath: 'dist_dev'
};
if(process.env.NODE_ENV == 'development'){
  webpackConfig.devtool = '#eval';
  webpackConfig.entry.boot.unshift('webpack-dev-server/client?http://' +
                                    webpackConfig.devServer.host + ':' +
                                    webpackConfig.devServer.port);
}

if(process.env.NODE_ENV == 'production'){
  var _dir = 'dist'// + (+new Date());
  var staticsUrl = process.env.STATICS;
  if(!staticsUrl){
    staticsUrl = pkg.staticsUrl || '//localhost';
  }
  webpackConfig.output = {
    path: _dir,
    publicPath: staticsUrl + '/' + _dir + '/',
    filename: '[name]-[chunkhash].js',
    pathinfo: false
  };
}else{
  webpackConfig.output = {
    path: 'dist_dev',
    publicPath: 'http://' +
                webpackConfig.devServer.host +
                ':' +
                webpackConfig.devServer.port +
                '/' +
                webpackConfig.devServer.outputPath +
                '/',
    filename: '[name].js',
    pathinfo: true
  };
}

//// plugins
webpackConfig.plugins = [];
// only add uglify plugin when in production
// and must put this in first
if(process.env.NODE_ENV == 'production'){
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      ascii_only: true
    },
    comments: false
  }));
}
webpackConfig.plugins.push(new ReplaceTaskWebpackPlugin({
  patterns: [{
    match: 'staticsUrl',
    replacement: function(){
      return webpackConfig.output.publicPath
    }
  }]
}));

webpackConfig.plugins.push(new htmlWebpackPlugin({
  filename: './index.html',
  'template': path.resolve(__dirname, 'index.orig.html')
}));

if(process.env.NODE_ENV == 'development'){
  webpackConfig.plugins.push(new WriteFilePlugin());
}


//// module loaders
webpackConfig.module = {
  loaders: [
    {
      test: /(services\/.*)|(directives\/.*)/,
      exclude: /runtimes\/[^\/]*\/.*/,
      loader: 'then?global,[name]'
    },
    {
      test: /promiz\.js$/,
      loader: 'expose?Promise'
    },
    { // 1
      test: /\.css$/,
      loader: 'style'
    },
    { // 2
      test: /\.css$/,
      loader: 'css',
      query: {
        minimize: true
      }
    },
    { // 3
      test: /\.css$/,
      loader: 'postcss'
    },
    { // 1
      test: /\.html$/,
      loader: 'html'
    },
    { // 2
      test: /\.html$/,
      loader: 'html-minifier'
    },
    {
      test: /\.(gif|png|jpe?g)$/,
      loader: 'file',
      query: {
        name: '[path][name]-[hash].[ext]'//,
        // context: 'statics/dishes/'
      }
    },
    // {
    //   test: /\.(gif|png|jpe?g)$/,
    //   loader: 'image-webpack',
    //   query: {
    //     bypassOnDebug: true,
    //     optimizationLevel: 4,
    //     progressive: true,
    //     interlaced: true
    //   }
    // },
    {
      test: /\.(eot|woff|woff2|ttf|svg)$/,
      loader: 'file?name=fonts/[name]-[hash].[ext]'
    }
  ]
};

webpackConfig['postcss'] = function(){
  return [autoprefixer({
    browsers: ['> 1%']
  })];
};

webpackConfig['html-minifier-loader'] = {
  collapseWhitespace: true,
  removeComments: true
};

