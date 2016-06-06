var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var APP_DIR = path.resolve(__dirname, 'app');
var bundlePath = path.resolve(__dirname, 'static/dist');

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname),
  entry: {
    main: path.resolve(APP_DIR, 'index.js')
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: bundlePath,
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.css$/, loader: 'style!css'},
      { test: /\.scss$/, loader: 'style!css!sass'},
      { test: /\.(png|jpg)$/, loader: 'url?limit=25000'},
      { test: /\.(otf|eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url' }
    ]
  },

  resolve: {
    modulesDirectories: [
      'app',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx']
  },

  plugins: [
    new CleanPlugin([bundlePath]),
    //new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,  // <------- DISABLE redux-devtools HERE,
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin('shared.js')
  ]
};