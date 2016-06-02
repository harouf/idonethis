var firebase = require("firebase");
var config = require('config');
var path = require('path');

const appConfig = {
  serviceAccount: path.resolve(__dirname, '..', config.get('firebase.serviceKeyPath')),
  //serviceAccount: config.get('firebase.serviceAccount'),
  databaseURL: config.get('firebase.databseUrl')
};
console.log('app config: ', appConfig);

firebase.initializeApp(appConfig);

module.exports = firebase.database();