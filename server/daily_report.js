var config = require('config');
var _ = require('lodash');
var moment = require('moment');
var sendgrid  = require('sendgrid')(config.get('sendgrid.apiKey'));
var db = require('./firebase');

module.exports = function(agenda) {
	agenda.define('daily report', function(job, done) {
	  console.log(new Date(), 'daily email job!');
	  
	  const to = job.attrs.data.email;
	  const uid = job.attrs.data.uid;
	  const template = _.clone(config.get('daily_report.template'));
	  const curDate = moment();
	  const accmpDate = '2016-05-26'; //curDate.format('YYYY-MM-DD');

	  template.to = to;
	  template.subject = template.subject.replace('{date}', curDate.format('dddd, MMMM DD'))

	  template.html = template.html.replace('{date}', curDate.format('dddd, MMMM DD')).replace('{last_year_date}', curDate.subtract(1, 'year').format('dddd, MMMM DD, YYYY'));

	  db.ref('accomplishments/' + uid + '/' + accmpDate).once('value', (snapshot) => {
	  	const data = snapshot.val();
	  	const done_items = _.values(data.done);
	  	var mainBody = "<ul style='padding: 0; list-style: none;'>\n";

	  	_.each(_.groupBy(done_items, 'timeOfDay'), (list, time) => {
	  		mainBody = mainBody + "<li>&#9634; *" + _.capitalize(time) + "</li>\n";
	  		_.each(list, (item, i) => {
	  			mainBody = mainBody + "<li>&#9634; &nbsp;- " + item.categories.join('/') + ": " + item.text + "</li>\n";
	  		});
	  	});
	  	mainBody = mainBody + "<li>&#9634; *Overall</li>\n";
	  	mainBody = mainBody + "<li>&#9634; &nbsp;" + _.capitalize(data.rating) + "</li>\n";
	  	mainBody = mainBody + "<li>&#9634; &nbsp;" + data.summary + "</li>\n";
	  	mainBody = mainBody + "</ul>\n";
	  	
	  	template.html = template.html.replace('{body}', mainBody);
	  	//template.html = template.html.replace('{body}', data.fullText);
		  
		  var email = new sendgrid.Email(template);
		  sendgrid.send(email, function(err, json) {
			  if (err) { return console.error(err); }
			  console.log(json);
		  		done();
			});
	  });
	});
}