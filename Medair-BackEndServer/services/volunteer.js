var mysql = require("./mysql");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/medair";
var hash = require('./encryption').hash;

exports.createVolunteer = function(msg, callback){
	console.log('create volunteer');
			mongo.connect(mongoURL, function () {
				var json_responses;
				console.log('Connected to mongo at: ' + mongoURL);
				var coll = mongo.collection('Volunteer');
				console.log("order creation ");
				var params = {
					'firstName': msg.firstName,
					'lastName': msg.lastName,
					'email': msg.email,
					'password': msg.password,
					'cnfPassword': msg.cnfPassword,
					'address': msg.address,
					'city': msg.city,
					'zipcode': msg.zipcode,
					'country': msg.country,
					'gender': msg.gender,
					'phoneNumber': msg.phoneNumber,
					'dob': msg.dob
				};
				coll.insert(params, function (err, result) {
					var jsonResponse;
					if (err) {
						jsonResponse = {'statusCode': 401};
						callback(null, jsonResponse);
					} else {
						jsonResponse = {'statusCode': 200};
						callback(null, jsonResponse);
					}
				});
			});
};

exports.getAllVolunteers = function(msg, callback){
	console.log('create volunteer');
	mongo.connect(mongoURL, function () {
		var json_responses;
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('Volunteer');
		console.log("order creation ");
		var params = {};
		coll.find(params).toArray(function (err, result) {
			var jsonResponse;
			if (err) {
				jsonResponse = {'statusCode': 401};
				callback(null, jsonResponse);
			} else {
				jsonResponse = {'statusCode': 200, 'result':result};
				callback(null, jsonResponse);
			}
		});
	});
};