var path = require('path');
var express = require('express');

if (process.env.NODE_ENV == 'development'){
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');
  var config = require('../webpack.config');
  var server = new WebpackDevServer(webpack(config), {
    contentBase: path.resolve(__dirname, '..', 'static'),
    hot: true,
    publicPath: '/dist/',
    headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials" : "true", "Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE", "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" },
    historyApiFallback: true,
    stats: {
      colors: true
    }
  })

  server.listen(3000, 'localhost', function (err) {
    if(err){
      console.log(err);
    }
    console.log('Listening at localhost:3000');
  });
} else {
  var app = new express();
  var static_path = path.resolve(__dirname, '..', 'static');

  app.use('/dist', express.static(path.resolve(static_path, 'dist')));
  app.use('/assets', express.static(path.resolve(static_path, 'assets')));
  app.use('/', function(req, res) {
    res.sendFile(path.resolve(static_path, 'index.html'));
  });

  app.listen(8080, function() {
    console.log('Server listening on port 8080');
  });
}
