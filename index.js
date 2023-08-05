/*
Main app for Meja Mobile Application

@author Nelson Maligro
@copyright 2020
@license GPL
*/
const express = require('express');
const layouts = require('express-ejs-layouts');
const mobapi = require('./controllers/mobileapi');
var https = require('http');
//var https = require('https');
const fs = require('fs');
var domain = require('domain');
var rateLimit = require('express-rate-limit');
const date = require('date-and-time');

process.env.salt = 'internationalmeja@@@2028';
// create a write stream (in append mode)
//var accessLogStream = fs.createWriteStream('access-'+Date.now()+'.log',{flags: 'a'});

var d = domain.create();
setTimeout (()=>{

  d.on('error', function(err) {
    let deyt = date.format(new Date,'MM-DD-YYYY');
    fs.appendFileSync('logs/err-'+ deyt +'.log',err.message + '\n' + err.stack + '\n');
    throw err;
  });

  d.run(function() {
      const httpsapp = express();
      const httpapp = express();
      // set up rate limiter: maximum of 5000 requests per minute
      var limiter =  rateLimit({
        windowMs: 1*60*1000, // 1 minute
        max: 5000
      });
      httpsapp.use(limiter);
      httpapp.use(limiter);

      // setup the logger
      //app.use(morgan('combined', {stream: accessLogStream}))
      //View Engine
      httpsapp.set('view engine','ejs');
      httpsapp.use(layouts);
      httpsapp.use(express.static(__dirname + '/public'));
      //run controllers
      mobapi(httpsapp);
/*
      let keyLoc = 'models/127.0.0.1.key'; let certLoc = 'models/127.0.0.1.cert';
      https.createServer({
        key: fs.readFileSync(keyLoc),
        cert: fs.readFileSync(certLoc)
      }, httpsapp)
      .listen(443, function () {
        console.log('Meja App running at https');
      });
      /*
      //For redirect
      httpApp.get('*', function(req, res) {
        res.redirect('https://' + req.headers.host + req.url);
      });
      httpApp.use(function(request, response){
        if(!request.secure){
          response.redirect("https://" + request.headers.host + request.url);
        }
      })
*/
      https.createServer(httpsapp)
      .listen(80, function () {
        console.log('App running at http');
      });

  });
},1000);
