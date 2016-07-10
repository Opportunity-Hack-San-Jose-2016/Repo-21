var hash = require('./encryption').hash;
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/medair";

//Check login - called when '/checklogin' POST call given from AngularJS module in login.ejs
exports.checkLogin = function (msg, callback) {
    var json_responses;
    if (!module.parent)
        console.log('authenticating %s:%s', msg.email, msg.password);

    mongo.connect(mongoURL, function () {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('Refugee');
        console.log("order creation ");
        var params = {
            'uid': msg.uid
        };
        coll.findOne(params, function (err, result) {
            var jsonResponse;
            if (err) {
                jsonResponse = {'statusCode': 401};
                callback(null, jsonResponse);
            } else {
                if (result.length() > 0) {
                    hash(msg.password, result.salt, function (err, hash) {
                        if (err) {
                            console.log("ERROR: " + err);
                            json_responses = {
                                "statusCode": 401,
                                "msg": "Some error occurred. Please try again later."
                            };
                            callback(null, json_responses);
                        } else {
                            if (hash.toString() === result.password) {
                                json_responses = {
                                    "statusCode": 200,
                                    "msg": "Login Successful!"
                                };

                                callback(null, jsonResponse);
                            }
                        }
                    });
                }
            }
        });
    });
};


function handle_request(msg, callback) {

    var username = msg.username;
    var password = msg.password;
    //var res = {};
    console.log("In handle request:" + msg.username);

    console.log("password:" + password);

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('login');

        coll.findOne({username: username, password: password}, function (err, user) {
            if (user) {
                // This way subsequent requests will know the user is logged in.
                //req.session.username = user.username;
                //console.log(req.session.username +" is the session");
                json_responses = {"statusCode": 200};
                //res.send(json_responses);

            } else {
                console.log("returned false");
                json_responses = {"statusCode": 401};
                //res.send(json_responses);
            }
        });
    });
    callback(null, json_responses);
}

exports.handle_request = handle_request;