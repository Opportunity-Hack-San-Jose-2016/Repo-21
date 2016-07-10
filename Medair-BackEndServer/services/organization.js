var mysql = require("./mysql");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/Medair";
var hash = require('./encryption').hash;

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

exports.getRequestByRefugee = function (msg, callback) {

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
                jsonResponse = {'statusCode': 200, 'refugeeRequests': result};
                callback(null, jsonResponse);
            }
        });
    });
};

exports.getLocations = function (msg,callback){

    mongo.connect(mongoURL, function () {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('Requests');
        var params = {
            'orgId': msg.orgId
        };
        coll.find(params,{'location':1}).toArray(function (err, result) {
            var jsonResponse;
            if (err) {
                jsonResponse = {'statusCode': 401}
                callback(null, jsonResponse);
            } else {
                jsonResponse = {'statusCode': 200, 'locations': result};
                callback(null, jsonResponse);
            }
        });
    });
}












//Code to Reuse
exports.deleteCustomer = function (msg, callback) {
    var query = "delete from customers where cust_id = ?";
    var json_responses;
    console.log("Query is:" + query);

    mysql.fetchData(function (err, results) {
        if (err) {
            console.log("ERROR: " + err);
            json_responses = {"statusCode": 401};
            callback(null, json_responses);
        }
        else {
            if (results.length > 0) {
                var rows = results;
                var jsonString = JSON.stringify(results);
                var jsonParse = JSON.parse(jsonString);
                json_responses = {"statusCode": 200, result: jsonParse};
                //console.log(jsonParse);
                callback(null, json_responses);
            }
            else {
                console.log('Error occurred in deleting customer.');
                json_responses = {"statusCode": 401};
                callback(null, json_responses);
            }
        }
    }, query, [msg.custId]);
};

exports.getAllCustomers = function (msg, callback) {
    var query = "select * from customers";
    var json_responses;
    console.log("Query is:" + query);

    mysql.fetchData(function (err, results) {
        if (err) {
            console.log("ERROR: " + err);
            json_responses = {"statusCode": 401};
            callback(null, json_responses);
        }
        else {
            if (results.length > 0) {
                var rows = results;
                var jsonString = JSON.stringify(results);
                var jsonParse = JSON.parse(jsonString);
                json_responses = {"statusCode": 200, result: jsonParse};
                //console.log(jsonParse);
                callback(null, json_responses);
            }
            else {
                console.log('Error occurred in getting all customers.');
                json_responses = {"statusCode": 401};
                callback(null, json_responses);
            }
        }
    }, query);
};

exports.generateBill = function (msg, callback) {

};

exports.selectDeliveryDateTime = function (msg, callback) {

};

exports.postReviewRating = function (msg, callback) {
    mongo.connect(mongoURL, function () {
        var json_responses;
        var coll = mongo.collection('reviewrating');
        var jsonParams = {
            "cust_id": msg.custId,
            "product_id": msg.productId,
            "review": msg.review,
            "rating": msg.rating
        };
        coll.insert(jsonParams, function (err, results) {
            if (err) {
                console.log("ERROR: " + err);
                json_responses = {"statusCode": 401};
                callback(null, json_responses);
            }
            else {
                json_responses = {"statusCode": 200};
                callback(null, json_responses);
            }
        });
    });

};

exports.editprofileCustomer = function (msg, callback) {

    console.log('reached edit farmer');
    var updateprofilequery = "UPDATE customers SET first_name='" + msg.lastname + "', last_name='" + msg.firstname + "', city='" + msg.city + "', state='" + msg.state + "', zipcode='" + msg.zipcode + "', contact='" + msg.contact + "' where far_id='" + msg.customerId + "'";
    var json_responses;
    console.log("Query is:" + query);
    console.log(msg.city);
    mysql.fetchData(function (err, results) {
        if (err) {
            console.log("ERROR: " + err);
            json_responses = {"statusCode": 401};
            callback(null, json_responses);
        }
        else {

            /*	var rows = results;
             var jsonString = JSON.stringify(results);
             var jsonParse = JSON.parse(jsonString);*/
            console.log('reached else');
            json_responses = {"statusCode": 200};
            //console.log(jsonParse);
            callback(null, json_responses);

        }
    }, updateprofilequery, []);


};

exports.viewCustomerProfile = function (msg, callback) {

    console.log('reached view customer');
    var q = "select cust_id, customer_id, first_name, last_name, address, city, address, zipcode, email, contact, approved from customers where customer_id = ?";
    var json_responses;
    console.log("Query is:" + q);
    mysql.fetchData(function (err, results) {
        if (err) {
            console.log("ERROR: " + err);
            json_responses = {"statusCode": 401};
            callback(null, json_responses);
        }
        else {

            var jsonString = JSON.stringify(results);
            var jsonParse = JSON.parse(jsonString);
            console.log('reached else');
            json_responses = {"statusCode": 200, user: jsonParse};
            //console.log(jsonParse);
            callback(null, json_responses);

        }
    }, q, [msg.cust_id]);

};
