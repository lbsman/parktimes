const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const func = require('./func.js');
// include the Themeparks library
var Themeparks = require("themeparks");


Themeparks.Settings.CacheWaitTimesLength = 120;

// configure where SQLite DB sits
// optional - will be created in node working directory if not configured
// Themeparks.Settings.Cache = __dirname + "/themeparks.db";

// access a specific park
//  Create this *ONCE* and re-use this object for the lifetime of your application
//  re-creating this every time you require access is very slow, and will fetch data repeatedly for no purpose
const DisneyWorldMagicKingdom = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();
const DisneyAnimal = new Themeparks.Parks.WaltDisneyWorldAnimalKingdom();
const DisneyEpcot = new Themeparks.Parks.WaltDisneyWorldEpcot();
const DisneyHollywood = new Themeparks.Parks.WaltDisneyWorldHollywoodStudios();

var mkData;
var akData;
var epData;
var hstudData;

const mkTimes = () => {
  mkData = ``;
  DisneyWorldMagicKingdom.GetWaitTimes().then((rideTimes) => {
    mkData += func.buildWorld(rideTimes);
  }).catch((error) => {
    console.error(error);
  }).then(() => {    
    setTimeout(mkTimes, 1000 * 60 * 5); // refresh every 5 minutes
  });        
};
const akTimes = () => {
  akData = ``;
  DisneyAnimal.GetWaitTimes().then((rideTimes) => {
    akData += func.buildWorld(rideTimes);
  }).catch((error) => {
    console.error(error);
  }).then(() => {    
    setTimeout(akTimes, 1000 * 60 * 5); // refresh every 5 minutes
  });        
};
const epTimes = () => {
  epData = ``;
  DisneyEpcot.GetWaitTimes().then((rideTimes) => {
    epData += func.buildWorld(rideTimes);
  }).catch((error) => {
    console.error(error);
  }).then(() => {    
    setTimeout(epTimes, 1000 * 60 * 5); // refresh every 5 minutes
  });        
};
const hstudTimes = () => {
  hstudData = ``;
  DisneyHollywood.GetWaitTimes().then((rideTimes) => {
    hstudData += func.buildWorld(rideTimes);
  }).catch((error) => {
    console.error(error);
  }).then(() => {    
    setTimeout(hstudTimes, 1000 * 60 * 5); // refresh every 5 minutes
  });        
};








app.get('/mktimes', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(mkData);
});

app.get('/aktimes', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(akData);
});

app.get('/eptimes', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(epData);
});

app.get('/hstudtimes', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(hstudData);
});


app.use(function(req, res){
  res.end('Wrong loco');
});

app.listen(port, () => {
  console.log('Started on port ' + port);
  mkTimes();
  epTimes();
  hstudTimes();
  akTimes();
});