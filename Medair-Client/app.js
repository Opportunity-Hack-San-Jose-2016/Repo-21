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
    ,organization = require('./routes/organization');

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/medair";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");

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
app.set('port', process.env.PORT || 3000);
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
app.get('/homepage', login.redirectToHomepage);
app.get('/logout', login.logout);
app.get('/getRequestByRefugee', sessionMgmt.restrict,organization.getRequestByRefugee);

app.get('/getOrgLocation', sessionMgmt.restrict,organization.getLocations);
app.get('/getAllRefugees', sessionMgmt.restrict,user.getAll);
app.get('/getNumberOfInProgressRequests', sessionMgmt.restrict,organization.noofinprogressrequests);
app.get('/getNoOfCompletedRequests', sessionMgmt.restrict,organization.noofcompletedrequests);

//app.get('/getOrgLocation', sessionMgmt.restrict,organization.getLocations);
app.get('/getAllRefugees', sessionMgmt.restrict,user.getAll);
app.post('/getAllVolunteers', user.getAllVolunteers);

//POST
app.post('/login', login.checkLogin);
app.post('/register', user.register);
app.post('/volunteer_register', user.volunteer_register);
app.post('/textRequestService',user.textRequestService);
app.post('/requestHelp',user.requestHelp);
app.post('/getAllRefugeesRequests',user.getAllRefugeesRequests);
//app.post('/request',user.request);

app.post('/checkLogin', login.checkLogin);


app.get('/testAdmin', function (req, res, next){
	res.render('adminDashboard');
});

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
