var fs = require('fs');
var path = require('path');
var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var db = require('./firebase');

var router = express.Router();

router.post('/', function(req, res) {
	const title= req.body.title;
	const email = req.body.email;
  fs.readFile(path.resolve(__dirname, '..', 'examples/email.txt'), 'utf8', function (err,data) {
    if (err) {
      res.json({error: 'file does not exist'});
      return console.log(err);
    }
    var accmp = parseAccomplishments(title, data);
    db.ref('users').orderByChild('email').equalTo(email).once('value', (snapshot) => {
    	const uid = Object.keys(snapshot.val())[0];
    	var accmpRef = db.ref('accomplishments/' + uid + '/' + accmp.date);
    	accmpRef.set(_.omit(accmp.data, 'done'), function(err1) {
    		if (!err1) {
    			var doneRef = accmpRef.child('done');
    			accmp.data.done.forEach((d, i) => {
    				doneRef.push(d);
    			});
    			res.json({accomplishments: accmp});
    		} else {
    			res.json({error: 'error saving data to firebase.'});	
    		}
    	});
	  });
  });
});

function parseAccomplishments(title, body) {
	const times = ['Morning', 'Afternoon', 'Evening'];
	var lines = body.split("\n");
	var dateStr = title.substr(title.indexOf(',') + 1).trim();
	var date = '';
	if (dateStr) {
		date = moment(dateStr, 'MMMM DD').format('YYYY-MM-DD');
	}
	var data = { fullText: body, done: [] };
	var curTime = '';
	var isOverallSection = false;

	_.compact(lines).forEach((c, i) => {
		var trimmed = _.upperFirst(c.trim());
		if (times.indexOf(trimmed) > -1) {
			curTime = trimmed;
		} else if (trimmed == 'Overall') {
			isOverallSection = true;
		} else {
			if (isOverallSection) {
				data[(_.startsWith(trimmed, 'Good') || _.startsWith(trimmed, 'Bad')) ? 'rating' : 'summary'] = trimmed;
			} else if (_.startsWith(trimmed, '- ')) {
				trimmed = trimmed.substr(2).split(": ").map((t) => t.trim());
				trimmed[1] = !_.endsWith(trimmed[1], '.') ? (trimmed[1] + '.') : trimmed[1];
				
				var item = { categories: trimmed[0].split("/").map((t) => _.capitalize(t.trim())), text: trimmed[1], timeOfDay: curTime };
				const outerDelim = /(\.|\son\s|\sat\s|\sin\s)/ig;
				const innerDelim = /(?:,|\sor\s|\sand\s)/ig;
				
				var startingPos1 = 0, endingPos1 = 0;
				var startingPos2 = 0, endingPos2 = 0;
				var startingPos3 = 0, endingPos3 = 0;

				if (trimmed[1].indexOf(' w/ ') > -1) {
					startingPos1 = trimmed[1].indexOf(' w/ ') + 4;
					endingPos1 = trimmed[1].substr(startingPos1).search(outerDelim);
					item.persons = _.compact(trimmed[1].substr(startingPos1, endingPos1).split(innerDelim)).map((t) => t.trim());
				}
				if (item.persons && trimmed[1].indexOf(' at ', startingPos1 + endingPos1) > -1) {
					startingPos2 = trimmed[1].indexOf(' at ', startingPos1 + endingPos1) + 4;
					endingPos2 = trimmed[1].substr(startingPos2).search(outerDelim);
					item.location = trimmed[1].substr(startingPos2, endingPos2).trim();
				}
				if (item.location && trimmed[1].indexOf(' in ', startingPos2 + endingPos2) > -1) {
					startingPos3 = trimmed[1].indexOf(' in ', startingPos2 + endingPos2) + 4;
					endingPos3 = trimmed[1].substr(startingPos3).search(outerDelim);
					item.mapLocation = trimmed[1].substr(startingPos3, endingPos3).trim();
				}
				data.done.push(item);
			}
		}
	});
	return {date: date, data: data};
}

module.exports = router;