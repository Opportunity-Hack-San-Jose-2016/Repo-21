var mq_client = require('../rpc/client');
var ejs = require("ejs");

exports.signup = function (req, res) {
    if (req.session.user) {
        console.log('validated user');
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("customerHome", {user: req.session.user});
    } else {
        res.render('signup', {title: 'Sign up to Medair', alertClass: '', msg: ''});
    }
};

exports.register = function (req, res) {
    
        var queueName = 'createRefugee_queue';
        var msg_Payload = {
            'un_id': req.param('un_id'),
            'firstName': req.param('firstName'),
            'lastName': req.param('lastName'),
            'email': req.param('email'),
            'location': req.param('location'),
            'phoneNumber': req.param('phoneNumber'),
            'password': req.param('password'),
            'cnfPassword': req.param('cnfPassword'),
            'dob': req.param('dob'),
            'gender': req.param('gender'),
            'disability': req.param('disability')
        };
    mq_client.make_request(queueName, msg_Payload, function (err, results) {
        if (err) {
            console.log('Err: ' + err);
            res.send(results);
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

exports.volunteer_register = function (req, res) {
    console.log('inside register volunteer');
    var queueName = 'createVolunteer_queue';
    var msg_Payload = {
        'firstName': req.param('firstName'),
        'lastName': req.param('lastName'),
        'email': req.param('email'),
        'address': req.param('address'),
        'city': req.param('city'),
        'zipcode': req.param('zipcode'),
        'country': req.param('country'),
        'phoneNumber': req.param('phoneNumber'),
        'password': req.param('password'),
        'cnfPassword': req.param('cnfPassword'),
        'dob': req.param('dob'),
        'gender': req.param('gender')
    };
mq_client.make_request(queueName, msg_Payload, function (err, results) {
    if (err) {
        console.log('Err: ' + err);
        res.send(results);
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

exports.requestHelp = function (req, res) {

    var msg_Payload = {
        'uid': req.param('uid'),
        'orgId': req.param('orgId'),
        'organization': req.param('organization'),
        'firstName': req.param('firstName'),
        'lastName': req.param('lastName'),
        'services': req.param('services'),
        'location': req.param('locations'),
        'password': req.param('password'),
        'disability': req.param('disability')
    };
    mq_client.make_request('requestHelp_queue', msg_Payload, function (err, results) {
        if (err) {
            console.log('Err: ' + err);
            res.send(results);
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

exports.getAll = function (req, res) {
    var msg_Payload = {};
    mq_client.make_request('getAllRefugees_queue', msg_Payload, function (err, results) {
        if (err) {
            console.log('Err: ' + err);
            res.send(results);
            //throw err;
        } else {
            if (results.statusCode == 200) {
                console.log('Result - All refugees - '+results.result);
                for(var i = 0; i < results.result.length; i++){
                    
                }
                res.send(results.result);
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


exports.getAllVolunteers = function (req, res) {
    var msg_Payload = {};
    mq_client.make_request('getAllVolunteers_queue', msg_Payload, function (err, results) {
        if (err) {
            console.log('Err: ' + err);
            res.send(results);
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
