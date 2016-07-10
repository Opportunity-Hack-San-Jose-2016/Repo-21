var mysql = require("./mysql");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/medair";
var hash = require('./encryption').hash;

exports.createRefugee = function(msg, callback){

	var saltGen, hashGen;
	hash(msg.password, function (err, salt, hash) {
		if (err) {
			throw err;
		} else {
			saltGen = salt;
			console.log('salt: ' + salt);
			hashGen = hash.toString();
			console.log('hash: ' + hash);

			mongo.connect(mongoURL, function () {
				var json_responses;
				console.log('Connected to mongo at: ' + mongoURL);
				var coll = mongo.collection('Refugee');
				console.log("order creation ");
				var params = {
					'uid': msg.uid,
					'firstName': msg.firstName,
					'lastName': msg.lastName,
					'password': msg.password,
					'location': msg.location,
					'city': msg.city,
					'state': msg.state,
					'zipcode': msg.zipcode,
					'gender': msg.gender,
					'disability': msg.disability
				};
			});
			coll.insert(params, function (err, result) {
				var jsonResponse;
				if (err) {
					jsonResponse = {'statusCode': 401}
					callback(null, jsonResponse);
				} else {
					jsonResponse = {'statusCode': 200};
					callback(null, jsonResponse);
				}
			});
		}
	});
};


exports.requestHelp = function(msg,callback){

	mongo.connect(mongoURL, function () {
		var json_responses;
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('HelpRequests');
		console.log("order creation ");
		var params = {
			'uid': msg.uid,
			'orgId': msg.orgId,
			'organization':msg.organization,
			'firstName':msg.firstName,
			'lastName':msg.lastName,
			'services': msg.services,
			'location': msg.location,
			'password': msg.password,
			'disability':msg.disability,
			'request_status': 'new'
		};
	});
	coll.insert(params, function (err, result) {
		var jsonResponse;
		if (err) {
			jsonResponse = {'statusCode': 401}
			callback(null, jsonResponse);
		} else {
			jsonResponse = {'statusCode': 200};
			callback(null, jsonResponse);
		}
	});
	
}