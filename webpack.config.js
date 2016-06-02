var path = require('path');
var webpack = require('webpack');
var APP_DIR = path.resolve(__dirname, 'app');


module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname),
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    path.resolve(APP_DIR, 'index.js')
  ],

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, 'static/dist'),
    publicPath: '/dist/'
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/, loader: 'style!css!sass' },
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true  // <------- DISABLE redux-devtools HERE
    }),
    new webpack.optimize.CommonsChunkPlugin('shared.js')
  ]
};