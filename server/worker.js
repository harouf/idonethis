var Agenda = require('agenda');
var config = require('config');
var _ = require('lodash');
var agenda = new Agenda({db: {address: config.get('database')}});
var db = require('./firebase');

console.log('connecting to ', config.get('database'));

require('./daily_report')(agenda);

agenda.on('ready', function() {
  agenda.start();
  db.ref('users').once('value', function(snapshot) {
  	const users = snapshot.val();
	  _.each(users, (val, key) => {
	  	console.log('id: ', key);
	  	console.log('email: ', val.email);
	  	//agenda.every(config.get('daily_report.schedule'), 'daily report', {uid: key, email: val.email});
	  	agenda.schedule('in 3 seconds', 'daily report', {uid: key, email: val.email});
	  });
	}, function(err) {
		console.error(err);
	});  
});

function graceful() {
  agenda.stop(function() {
    process.exit(0);
  });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);
