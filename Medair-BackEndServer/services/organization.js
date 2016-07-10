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
                        jsonResponse = {'statusCode': 401}
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

exports.noofrequests = function (msg, callback) {

    mongo.connect(mongoURL, function () {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('Requests');
        var params = {
            'orgId': msg.orgId
        };
        coll.find(params).toArray(function (err, result) {
            var jsonResponse;
            if (err) {
                jsonResponse = {'statusCode': 401}
                callback(null, jsonResponse);
            } else {
                jsonResponse = {'statusCode': 200, 'noofrequests': result};
                callback(null, jsonResponse);
            }
        });
    });
};





