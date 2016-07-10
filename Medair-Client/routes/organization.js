var mq_client = require('../rpc/client');
var ejs = require("ejs");

exports.getRequestByRefugee = function (req, res) {

    var msg_Payload = {
        'ordId': req.param('orgId'),
    };

    mq_client.make_request('getRequestByRefugee_queue', msg_Payload, function (err, results) {
        if (err) {
            console.log('Err: ' + err);
            res.send({'statusCode': 402});
            //throw err;
        } else {
            if (results.statusCode == 200) {
                console.log('Successful creation of User!');
                res.send(results);
            } else if (results.statusCode == 402) {
                console.log('User already exist.');
                res.send(results);
            } else {
                console.log('Error Occured!');
                res.send(results);
            }
        }
    });
};

exports.noofnewrequests = function (req, res) {

    var msg_Payload = {

        'orgId': req.session.param('orgId'),
    };

    mq_client.make_request(noofreuqests_queue, msg_Payload, function (err, results) {
        if (err) {
            console.log('Err: ' + err);
            res.send({'statusCode': 402});

        } else {
            if (results.statusCode == 200) {
                console.log('');
                res.send(results);
            } else {
                console.log('Error Occured!');
                res.send(results);
            }
        }
    });
};

exports.getLocations = function (req, res) {

    var jsonResponse;
    var msg_Payload = {
        'orgId': req.param('orgId'),
    };

    mq_client.make_request('getLocations_queue', msg_Payload, function (err, results) {
        if (err) {
            console.log('Err: ' + err);
            res.send({'statusCode': 402});
            //throw err;
        } else {
            if (results.statusCode == 200) {
                console.log('Successful creation of User!');
                res.send(results);
            } else if (results.statusCode == 402) {
                console.log('User already exist.');
                res.send(results);
            } else {
                console.log('Error Occured!');
                res.send(results);
            }
        }
    });
};

exports.noofinprogressrequests = function (req, res) {

    var jsonResponse;
    var msg_Payload = {
        'ordId': req.param('orgId')
    };

    mq_client.make_request('getNoOfInProgressRequests_queue', msg_Payload, function (err, results) {
        if (err) {
            console.log('Err: ' + err);
            res.send({'statusCode': 402});
            //throw err;
        } else {
            if (results.statusCode == 200) {
                console.log('Successful creation of User!');
                res.send(results);
            } else if (results.statusCode == 402) {
                console.log('User already exist.');
                res.send(results);
            } else {
                console.log('Error Occured!');
                res.send(results);
            }
        }
    });
};

exports.noofcompletedrequests = function (req, res) {

    var jsonResponse;
    var msg_Payload = {
        'ordId': req.param('orgId')
    };

    mq_client.make_request('getNoOfCompletedRequests_queue', msg_Payload, function (err, results) {
        if (err) {
            console.log('Err: ' + err);
            res.send({'statusCode': 402});
            //throw err;
        } else {
            if (results.statusCode == 200) {
                console.log('Successful creation of User!');
                res.send(results);
            } else if (results.statusCode == 402) {
                console.log('User already exist.');
                res.send(results);
            } else {
                console.log('Error Occured!');
                res.send(results);
            }
        }
    });
};
