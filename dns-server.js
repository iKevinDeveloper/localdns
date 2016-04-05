var util = require('util');
var config = require('config');
var dnsd = require('dnsd');
var db = require('./db')();
var User = require('./models/user');

var server = dnsd.createServer(function(req, res) {
	var question = res.question && res.question[0];

	console.log('%s lookup for domain: %s', question.name, question.type);

	if (question.name !== config.domain && !question.name.endsWith('.' + config.domain)) {
		res.responseCode = 5; // REFUSED
		return res.end();
	}

	config.dns.records.forEach(function(record) {
		if (record.name && record.type === 'NS') {
            return;
        }

		var name = record.name ? record.name + '.' + config.domain : config.domain;
		if (name !== question.name) return;

		if (question.type === '*' || record.type === question.type) {
			res.answer.push({ 'name': name, 'type': record.type, 'data': record.data });
		}
	});

	if (res.answer.length || question.type === 'SOA') return res.end();

	try {
		var user = User.findOne({ sub: question.name.substring(0, question.name.lastIndexOf('.' + config.domain)) }, function (err, doc) {
			if (!err && doc) {
				if (question.type == 'A' || question.type == '*') {
					res.answer.push({ 'name': question.name, 'type': 'A', 'data': doc.ip });
				}
			} else {
				res.responseCode = 3; // NXDOMAIN
			}

			return res.end();
		});
	} catch (ex) {
		res.responseCode = 2; // SERVFAIL
		return res.end();
	}
});

server.zone(config.domain, 'ns1.' + config.domain, config.contact || 'contact@' + config.domain, 'now', '2h', '30m', '2w', '1m').listen(process.env.PORT || config.dns.port || 53, process.env.HOST || config.dns.host || '0.0.0.0');
