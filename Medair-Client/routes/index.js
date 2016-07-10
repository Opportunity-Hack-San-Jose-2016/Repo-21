var mq_client = require('../rpc/client');
var ejs = require("ejs");

exports.index = function(req, res){
	if (req.session.user) {
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("adminDashboard", {
				user : req.session.user,
			});
		
	} else {
		console.log('index');
		res.render('index');
	}
};

exports.signIn = function signIn(req,res) {

	ejs.renderFile('./views/index.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
};

exports.signUp = function signUp(req,res) {

	ejs.renderFile('./views/signup.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
};

exports.volunteer_signUp = function volunteer_signUp(req,res) {

	ejs.renderFile('./views/volunteer_signup.ejs',function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};
exports.adminSignIn = function adminSignIn(req,res) {

	ejs.renderFile('./views/adminSignin.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
};

exports.checkAdminLogin = function checkAdminLogin(req,res) {
	var json_response;
	if(req.param('email') === 'admin@gmail.com' && req.param('password') === '123' && req.param('adminKey') === '123'){
		var admin = {name: "Shivakumar"};
		req.session.user = admin;
		json_response = {statusCode: 200};
	    res.send(json_response);
	} else {
		json_response = {statusCode: 401, errMsg: "Invalid Credentials"};
	    res.send(json_response);
	}
};

exports.adminDashboard = function adminDashboard(req,res) {
	res.render("adminDashboard", {
		adminUser : req.session.user
	});
};