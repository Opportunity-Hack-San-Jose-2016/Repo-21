var mysql = require("./mysql");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/medair";
var hash = require('./encryption').hash;


/*
 * 
 * */
exports.createOrganization = function (msg, callback) {

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
                var coll = mongo.collection('Organization');
                var params = {
                    'orgId': msg.orgId,
                    'services': msg.services,
                    'locations': msg.locations,
                    'password': hashGen,
                    'salt': salt,
                    'location': msg.location,
                    'contactPerson': msg.contactPerson,
                    'number': msg.number
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

        }
    });
};

exports.noofnewrequests = function (msg, callback) {

    mongo.connect(mongoURL, function () {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('Requests');
        var params = {
            'orgId': msg.orgId
        };
        coll.find({'request_status': 'new'}).count(function (err, result) {
            var jsonResponse;
            if (err) {
                jsonResponse = {'statusCode': 401};
                callback(null, jsonResponse);
            } else {
                jsonResponse = {'statusCode': 200, 'noofnewrequests': result};
                callback(null, jsonResponse);
            }
        });
    });
};

exports.noofinprogressrequests = function (msg, callback) {

	mongo.connect(mongoURL, function () {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('Requests');
        var params = {
            'orgId': msg.orgId
        };
        coll.find({'request_status': 'in progress'}).count(function (err, result) {
            var jsonResponse;
            if (err) {
                jsonResponse = {'statusCode': 401};
                callback(null, jsonResponse);
            } else {
                jsonResponse = {'statusCode': 200, 'noofinprogressrequests': result};
                callback(null, jsonResponse);
            }
        });
    });
};

exports.noofcompletedrequests = function (msg, callback) {

	mongo.connect(mongoURL, function () {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('Requests');
        var params = {
            'orgId': msg.orgId
        };
        coll.find({'request_status': 'completed'}).count(function (err, result) {
            var jsonResponse;
            if (err) {
                jsonResponse = {'statusCode': 401};
                callback(null, jsonResponse);
            } else {
                jsonResponse = {'statusCode': 200, 'noofcompletedrequests': result};
                callback(null, jsonResponse);
            }
        });
    });
};

exports.getLocations = function(msg,callback){
    mongo.connect(mongoURL, function () {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('Organizations');
        var params = {
            'orgId': msg.orgId
        };
        coll.find(params,{'Locations':1}).toArray(function (err, result) {
            var jsonResponse;
            if (err) {
                jsonResponse = {'statusCode': 401};
                callback(null, jsonResponse);
            } else {
                jsonResponse = {'statusCode': 200, 'Locations': result};
                callback(null, jsonResponse);
            }
        });
    });
};


exports.getOrganisationByServices = function(msg,callback){
    mongo.connect(mongoURL, function () {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('Organizations');
        var params = {
            'services': msg.services
        };
        coll.find(params,{'services':1}).toArray(function (err, result) {
            var jsonResponse;
            if (err) {
                jsonResponse = {'statusCode': 401};
                callback(null, jsonResponse);
            } else {
                jsonResponse = {'statusCode': 200, 'Locations': result};
                callback(null, jsonResponse);
            }
        });
    });
};


