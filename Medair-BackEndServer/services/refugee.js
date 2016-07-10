var mysql = require("./mysql");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/medair";
var hash = require('./encryption').hash;

exports.createRefugee = function (msg, callback) {

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
                    'uid': msg.un_id,
                    'firstName': msg.firstName,
                    'lastName': msg.lastName,
                    'email': msg.email,
                    'password': hash,
                    'salt': salt,
                    'cnfPassword': msg.cnfPassword,
                    'location': msg.location,
                    'gender': msg.gender,
                    'phoneNumber': msg.phoneNumber,
                    'dob': msg.dob,
                    'disability': msg.disability
                };
                coll.insert(params, function (err, result) {
                    var jsonResponse;
                    if (err) {
                        jsonResponse = {
                            'statusCode': 401
                        };
                        callback(null, jsonResponse);
                    } else {
                        jsonResponse = {
                            'statusCode': 200
                        };
                        callback(null, jsonResponse);
                    }
                });
            });

        }
    });
};

exports.requestHelp = function (msg, callback) {

    mongo.connect(mongoURL, function () {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('HelpRequests');
        console.log("order creation ");
        var params = {
            'uid': msg.uid,
            'orgId': msg.orgId,
            'organization': msg.organization,
            'firstName': msg.firstName,
            'lastName': msg.lastName,
            'services': msg.services,
            'location': msg.location,
            'request_status': 'new',
            'phoneNumber': msg.phoneNumber,
            'message': msg.message
        };
        coll.insert(params, function (err, result) {
            var jsonResponse;
            if (err) {
                jsonResponse = {
                    'statusCode': 401
                };
                callback(null, jsonResponse);
            } else {
                jsonResponse = {
                    'statusCode': 200
                };
                callback(null, jsonResponse);
            }
        });
    });

};

exports.textRequestService = function (msg, callback) {

    mongo.connect(mongoURL, function () {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('HelpRequests');
        var textRequest = {
            'text': msg.text,
            'phonenumber': msg.phonenumber,
            'uid': msg.uid,
            'location': msg.location
        };
        coll.find({'uid': textRequest.uid}, function (err, result) {
            var jsonResponse;
            if (err) {
                jsonResponse = {
                    'statusCode': 401
                }
                callback(null, jsonResponse);
            } else {
                var requestObject = {
                    'uid': textRequest.uid,
                    'orgId': null,
                    'organization': null,
                    'firstName': result.firstName,
                    'lastName': result.lastName,
                    'services': result.services,
                    'location': textRequest.location,
                    'request_status': 'new',
                    'phoneNumber': textRequest.phoneNumber,
                    'message': textRequest.message
                };

                var coll1 = mongo.collection('HelpRequests');
                coll.insert(requestObject, function (err, result) {
                    if (err) {
                        jsonResponse = {'statusCode': 401};
                        callback(null, jsonResponse);
                    } else {
                        jsonResponse = {'statusCode': 201};
                        callback(null, jsonResponse);
                    }
                });
            }
        });

    });
};

exports.getAll = function (msg, callback) {
    console.log('create volunteer');
    mongo.connect(mongoURL, function () {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('Refugee');
        console.log("order creation ");
        var params = {};
        coll.find(params).toArray(function (err, result) {
            var jsonResponse;
            if (err) {
                jsonResponse = {'statusCode': 401};
                callback(null, jsonResponse);
            } else {
                jsonResponse = {'statusCode': 200, 'result': result};
                callback(null, jsonResponse);
            }
        });
    });
};


exports.getAllHelpRequests = function (msg, callback) {
    console.log('getting all help req');
    mongo.connect(mongoURL, function () {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('HelpRequests');
        console.log("help req");
        var params = {};
        coll.find(params).toArray(function (err, result) {
            var jsonResponse;
            if (err) {
                jsonResponse = {'statusCode': 401};
                callback(null, jsonResponse);
            } else {
                jsonResponse = {'statusCode': 200, 'result': result};
                callback(null, jsonResponse);
            }
        });
    });
};