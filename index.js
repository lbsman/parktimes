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
var wdwData;

const wdwTimes = () => {
  wdwData = `{"parks":[`;
  DisneyWorldMagicKingdom.GetWaitTimes().then((rideTimes) => {
    wdwData += func.buildWorld('mk', rideTimes);
  }).catch((error) => {
      console.error(error);
  }).then(() => {    
    DisneyAnimal.GetWaitTimes().then((rideTimes) => {
      wdwData += func.buildWorld('ak', rideTimes);
    }).catch((error)=>{
      console.error(error);
    }).then(() => {
      DisneyEpcot.GetWaitTimes().then((rideTimes) => {
        wdwData += func.buildWorld('ep', rideTimes);
      }).catch((error) => {
        console.error(error);
      }).then(() => {
        DisneyHollywood.GetWaitTimes().then((rideTimes) => {
          wdwData += func.buildWorld('hw', rideTimes);
        }).catch((error) => {
          console.error(error);
        }).then(() => {
          wdwData = func.finalCleanWdw(wdwData);
          setTimeout(wdwTimes, 1000 * 60 * 5); // refresh every 5 minutes
        })        
      });
    });    
  });
};

app.get('/wdwtimes', (req, res) => {
  res.statusCode = 200;
  // Access wait times by Promise
  //console.log(disneyData);
  res.setHeader('Content-Type', 'text/plain');
  res.end(wdwData);
});

app.use(function(req, res){
  res.end('Wrong loco');
});

app.listen(port, () => {
  console.log('Started on port ' + port);
  wdwTimes();
});