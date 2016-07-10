/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , index = require('./routes/index')
    , login = require('./routes/login')
    , customer = require('./routes/customer')
    , sessionMgmt = require('./routes/sessionMgmt')
    , admin = require('./routes/admin')
    , user = require('./routes/user')
    bodyParser = require('body-parser')
    ,organization = require('./routes/organization');

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/medair";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");
var accountSid = 'ACdf220eed249fa26c2278f9e0070a517a';
var YOUR_TWILIO_AUTH_TOKEN = 'e890820cde48d5f34306f7b155a18abd';
var twilioNumber = '+13347210102';
twilio = require('twilio');

var app = express();

app.use(expressSession({
    secret: 'opportunityHack_teststring',
    resave: false,  //don't save session if unmodified
    saveUninitialized: false,	// don't create session until something stored
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    store: new mongoStore({
        url: mongoSessionConnectURL
    })
}));

// all environments
app.set('port', process.env.PORT || 4040);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


//GET
// Customer Module
app.get('/', routes.index);
app.get('/signin', index.signIn);
app.get('/signup', index.signUp);
app.get('/volunteer_signup', index.volunteer_signUp);
app.get('/homepage', login.redirectToHomepage);
app.get('/logout', login.logout);
app.get('/getRequestByRefugee', sessionMgmt.restrict,organization.getRequestByRefugee);

//app.get('/getOrgLocation', sessionMgmt.restrict,organization.getO);
app.get('/getAllRefugees', sessionMgmt.restrict,user.getAll);
app.get('/getNumberOfInProgressRequests', sessionMgmt.restrict,organization.noofinprogressrequests);
app.get('/getNoOfCompletedRequests', sessionMgmt.restrict,organization.noofcompletedrequests);


//app.get('/getOrgLocation', sessionMgmt.restrict,organization.getLocations);
app.get('/getAllRefugees', sessionMgmt.restrict,user.getAll);


//POST
//Create an SMS webhook that validates using your Twilio auth token, configured
//in "process.env.TWILIO_AUTH_TOKEN".  Also adds functionality to "response.send"
//to make it intelligently handle TwimlResponse objects.  If "response.send" is
//passed a TwimlResponse object, it will automatically set the proper
//Content-Type header and call "toString()" on the TwimlResponse object
app.post('/sms', function(request, response) {
	 console.log('reached post call');
	 var twiml = new twilio.TwimlResponse();
	 twiml.message('This HTTP request came from Twilio!');
	 
	 var body = request.body.Body.split(";");
	 /*var text = body[0];
	 var phonenumber= request.body.From;
	 var uid = body[1];
	 var location_lat =body[2];
	 var location_long=body[3];*/
	 
	 var msg_payload = {'text': body[0], 'phonenumber': request.body.From, 'uid': body[1], 'location_lat': body[2], 'location_long': body[3]};
	 
	 //req.param.msg_payload =  msg_payload;
	 
	 user.textRequestService(msg_payload);
});
	
app.post('/login', login.checkLogin);
app.post('/register', user.register);
app.post('/volunteer_register', user.volunteer_register);
app.post('/textRequestService',user.textRequestService);
app.post('/requestHelp',user.requestHelp);
app.post('/getAllRefugeesRequests',user.getAllRefugeesRequests);
//app.post('/request',user.request);
app.post('/getAllVolunteers',user.getAllVolunteers);
app.post('/checkLogin', login.checkLogin);
app.get('/testAdmin', index.adminDashboard);

app.post('/category',organization.getOrg);

app.use(function (req, res, next) {
    res.render('error');
});


//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function () {
    console.log('Connected to mongo at: ' + mongoSessionConnectURL);
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
});


