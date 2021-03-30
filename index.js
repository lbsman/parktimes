const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;
const func = require('./func.js');
const moment = require('moment');
// include the Themeparks library
var Themeparks = require("themeparks");
const WaltDisneyWorldMagicKingdom = require('themeparks/lib/disney/waltdisneyworldmagickingdom');


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
const UniversalOrlando = new Themeparks.Parks.UniversalStudiosFlorida();
const UniversalIsOfAd = new Themeparks.Parks.UniversalIslandsOfAdventure();
const UniversalBay = new Themeparks.Parks.UniversalVolcanoBay();
const buschWill = new Themeparks.Parks.BuschGardensWilliamsburg();
const swo = new Themeparks.Parks.SeaworldOrlando();
const canwon = new Themeparks.Parks.CanadasWonderland();
const alton = new Themeparks.Parks.AltonTowers();

var mkData;
var akData;
var epData;
var hstudData;
var universaleData;
var universalIslanData;
var universalBayData;
var willBusc;
var swodata;
var canData; 
var altonData;
parkNames = new Array();
parkNames = ['Magic Kingdom', 'Animal Kingdom', 'Epcot', 'Hollywood Studios', 'Univesal Orlando', 'Universal Island of Adventure',
            'Universal Volcano Bay', 'Busch Gardens Williamsburg', 'Sea World Orlando', 'Cananada Wonderlannd', 'Altonn Towers'];
parkArray = new Array();
parkArray = [DisneyWorldMagicKingdom,DisneyAnimal,DisneyEpcot,DisneyHollywood,
              UniversalOrlando,UniversalIsOfAd,UniversalBay,buschWill,swo,canwon,alton];
parkData = new Array();
parkData = [mkData,akData,epData,hstudData,
            universaleData,universalIslanData,universalBayData,willBusc,swodata,canData,altonData];

// parkNames = new Array();
// parkNames = ['Magic Kingdom'];
// parkArray = new Array();
// parkArray = [DisneyWorldMagicKingdom];
// parkData = new Array();
// parkData = [mkData];
            
function runInfo(){
  parkArray.forEach(function(element) {
    element.GetOpeningTimes().then((oTime)=>{
      element.GetWaitTimes().then((rideTimes) => {
        parkData[parkArray.indexOf(element)] = func.buildWorld(rideTimes, oTime[0].openingTime, oTime[0].closingTime, element.Timezone, element.FastPass, parkNames[parkArray.indexOf(element)]);
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error);
    });
  });
  setTimeout(runInfo, 1000 * 60 * 5); // refresh every 5 minutes 
}

//Here are the endpoints for the informations
app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname+'/formFill.html'));
});
app.get('/mktimes', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[0]);
});
app.get('/aktimes', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[1]);
});
app.get('/eptimes', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[2]);
  //res.end(parkData[0]);
  //res.end(epData);
});
app.get('/woodtimes', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[3]);
  //res.end(hstudData);
});
app.get('/universal', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[4]);
  //res.end(universaleData);
});
app.get('/island', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  //res.end(parkData[0])
  res.end(parkData[5]);
  //res.end(universalIslanData);
});
app.get('/volcanobay', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[6]);
  //res.end(universalIslanData);
});
app.get('/buschw', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[7]);
  //res.end(willBusc);
});
app.get('/swo', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[8]);
  //res.end(swodata);
});
app.get('/canwon', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[9]);
  //res.end(canData);
});
app.get('/alton', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[10]);
  //res.end(canData);
});

app.use(function(req, res){
  res.end('Wrong loco');
});

app.listen(port, () => {
  console.log('Started on port ' + port);
    runInfo();   
});




































// const mkTimes = () => {
//   mkData = ``;
//   DisneyWorldMagicKingdom.GetOpeningTimes().then((oTime)=>{
//     DisneyWorldMagicKingdom.GetWaitTimes().then((rideTimes) => {
//       mkData += func.buildWorld(rideTimes, oTime[0].openingTime, oTime[0].closingTime, DisneyWorldMagicKingdom.Timezone, DisneyWorldMagicKingdom.FastPass);
//       //mkData = '{"opening":"2021-03-24T08:00:00-04:00","closing":"2021-03-24T21:00:00-04:00","tz":"America/New_York","fp":false,"rides":[{"rideName":"Tomorrowland Speedway","rideWait":"0","fPass":"false","status":"Closed"},{"rideName":"Walt Disneys Carousel of Progress","rideWait":"40","fPass":"false","status":"Closed"},{"rideName":"Country Bear Jamboree","rideWait":"0","fPass":"false","status":"Closed"},{"rideName":"The Hall of Presidents","rideWait":"0","fPass":"false","status":"Refurbishment"}]}';
//       //console.log(mkData);
//     }).catch((error) => {
//       console.error(error);
//     }).then(() => {    
//       setTimeout(mkTimes, 1000 * 60 * 5); // refresh every 5 minutes
//     });
//   });
// };
// const akTimes = () => {
//   akData = ``;
//   DisneyAnimal.GetOpeningTimes().then((oTime)=>{
//     DisneyAnimal.GetWaitTimes().then((rideTimes) => {
//       akData += func.buildWorld(rideTimes, oTime[0].openingTime, oTime[0].closingTime, DisneyAnimal.Timezone, DisneyAnimal.FastPass);
//     }).catch((error) => {
//       console.error(error);
//     }).then(() => {    
//       setTimeout(akTimes, 1000 * 60 * 5); // refresh every 5 minutes
//     });
//   });       
// };
// const epTimes = () => {
//   epData = ``;
//   DisneyEpcot.GetOpeningTimes().then((oTime)=>{
//     DisneyEpcot.GetWaitTimes().then((rideTimes) => {
//       epData += func.buildWorld(rideTimes, oTime[0].openingTime, oTime[0].closingTime, DisneyEpcot.Timezone, DisneyEpcot.FastPass);
//     }).catch((error) => {
//       console.error(error);
//     }).then(() => {    
//       setTimeout(epTimes, 1000 * 60 * 5); // refresh every 5 minutes
//     });
//   });         
// };
// const hstudTimes = () => {
//   hstudData = ``;
//   DisneyHollywood.GetOpeningTimes().then((oTime)=>{
//     DisneyHollywood.GetWaitTimes().then((rideTimes) => {
//       hstudData += func.buildWorld(rideTimes, oTime[0].openingTime, oTime[0].closingTime, DisneyHollywood.Timezone, DisneyHollywood.FastPass);
//     }).catch((error) => {
//       console.error(error);
//     }).then(() => {    
//       setTimeout(hstudTimes, 1000 * 60 * 5); // refresh every 5 minutes
//     });
//   });         
// };
// const uTimesOr = () => {
//   universaleData = ``;
//   UniversalOrlando.GetOpeningTimes().then((oTime)=>{
//     UniversalOrlando.GetWaitTimes().then((rideTimes) => {
//       universaleData += func.buildWorld(rideTimes, oTime[0].openingTime, oTime[0].closingTime, UniversalOrlando.Timezone, UniversalOrlando.FastPass);
//     }).catch((error) => {
//       console.error(error);
//     }).then(() => {    
//       setTimeout(uTimesOr, 1000 * 60 * 5); // refresh every 5 minutes
//     });
//   });         
// };
// const islandTimes = () => {
//   universalIslanData = ``;
//   UniversalIsOfAd.GetOpeningTimes().then((oTime)=>{
//     UniversalIsOfAd.GetWaitTimes().then((rideTimes) => {
//       universalIslanData += func.buildWorld(rideTimes, oTime[0].openingTime, oTime[0].closingTime, UniversalIsOfAd.Timezone, UniversalIsOfAd.FastPass);
//     }).catch((error) => {
//       console.error(error);
//     }).then(() => {    
//       setTimeout(islandTimes, 1000 * 60 * 5); // refresh every 5 minutes
//     });
//   });         
// };
// const buschWilliams = () => {
//   willBusc = ``;
//   buschWill.GetOpeningTimes().then((oTime)=>{
//     buschWill.GetWaitTimes().then((rideTimes) => {
//       willBusc += func.buildWorld(rideTimes, oTime[0].openingTime, oTime[0].closingTime, buschWill.Timezone, buschWill.FastPass);
//     }).catch((error) => {
//       console.error(error);
//     }).then(() => {    
//       setTimeout(buschWilliams, 1000 * 60 * 5); // refresh every 5 minutes
//     });
//   });         
// };
// const buschTampa = () => {
//   tampBusc = ``;
//   buschTamp.GetOpeningTimes().then((oTime)=>{
//     console.log(oTime);
//     buschTamp.GetWaitTimes().then((rideTimes) => {
//       tampBusc += func.buildWorld(rideTimes, oTime[0].openingTime, oTime[0].closingTime, buschTamp.Timezone, buschTamp.FastPass);
//     }).catch((error) => {
//       console.error(error);
//     }).then(() => {    
//       setTimeout(buschTampa, 1000 * 60 * 5); // refresh every 5 minutes
//     });
//   });         
// };
// const swoInfo = () => {
//   swodata = ``;
//   swo.GetOpeningTimes().then((oTime)=>{
//     swo.GetWaitTimes().then((rideTimes) => {
//       swodata += func.buildWorld(rideTimes, oTime[0].openingTime, oTime[0].closingTime, swo.Timezone, swo.FastPass);
//     }).catch((error) => {
//       console.error(error);
//     }).then(() => {    
//       setTimeout(swoInfo, 1000 * 60 * 5); // refresh every 5 minutes
//     });
//   });         
// };
// const canInfo = () => {
//   canData = ``;
//   canwon.GetOpeningTimes().then((oTime)=>{
//     canwon.GetWaitTimes().then((rideTimes) => {
//       canData += func.buildWorld(rideTimes, oTime[0].openingTime, oTime[0].closingTime, canwon.Timezone, canwon.FastPass);
//     }).catch((error) => {
//       console.error(error);
//     }).then(() => {    
//       setTimeout(canInfo, 1000 * 60 * 5); // refresh every 5 minutes
//     });
//   });         
// };





// mkTimes();
// epTimes();
// hstudTimes();
// akTimes();
// uTimesOr();
// islandTimes();
// buschWilliams();
// swoInfo();
// canInfo();
// buschTampa();