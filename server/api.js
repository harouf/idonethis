var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var _ = require('lodash');
var moment = require('moment');

const app = express();
const port = process.env.NODE_ENV == 'development' ? 3001 : 8081;

const server = new http.Server(app);

require('./worker');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/test', function(req, res) {
  res.json({test: false});
});

app.listen(port, function(err) {
  if (err) {
    console.error(err);
  }
  console.info('----\n==> 🌎  API is running on port %s', port);
  console.info('==> 💻  Send requests to http://localhost:%s', port);
});
