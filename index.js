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
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// access a specific park
//  Create this *ONCE* and re-use this object for the lifetime of your application
//  re-creating this every time you require access is very slow, and will fetch data repeatedly for no purpose
const DisneyWorldMagicKingdom = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();
const DisneyAnimal = new Themeparks.Parks.WaltDisneyWorldAnimalKingdom();
const DisneyEpcot = new Themeparks.Parks.WaltDisneyWorldEpcot();
const DisneyHollywood = new Themeparks.Parks.WaltDisneyWorldHollywoodStudios();
const DisneyCali = new Themeparks.Parks.DisneylandResortMagicKingdom();
const DisneyCaA = new Themeparks.Parks.DisneylandResortCaliforniaAdventure();
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
var dLand;
var dCaA;

parkNames = new Array();
parkNames = ['Magic Kingdom', 'Animal Kingdom', 'Epcot', 'Hollywood Studios', 'Disneyland', 'California Adventure','Univesal Orlando', 'Universal Island of Adventure',
            'Universal Volcano Bay', 'Busch Gardens Williamsburg', 'Sea World Orlando', 'Cananada Wonderlannd', 'Altonn Towers'];

parkArray = new Array();
parkArray = [DisneyWorldMagicKingdom,DisneyAnimal,DisneyEpcot,DisneyHollywood,
              DisneyCali, DisneyCaA, UniversalOrlando,UniversalIsOfAd,UniversalBay,buschWill,swo,canwon,alton];

parkData = new Array();
parkData = [mkData,akData,epData,hstudData, dLand, dCaA,
            universaleData,universalIslanData,universalBayData,willBusc,swodata,canData,altonData];

// parkNames = new Array();
// parkNames = ['Magic Kingdom'];
// parkArray = new Array();
// parkArray = [DisneyWorldMagicKingdom];
// parkData = new Array();
// parkData = [mkData];
            
function runInfo(){
  parkArray.forEach(function(element) {
    var tempData = '';
    element.GetOpeningTimes().then((oTime)=>{
      element.GetWaitTimes().then((rideTimes) => {
        tempData = func.buildWorld(rideTimes, oTime[0].openingTime, oTime[0].closingTime, element.Timezone, element.FastPass, parkNames[parkArray.indexOf(element)]);
        parkData[parkArray.indexOf(element)] = tempData;
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
  //res.end('{"updateTime":"2021-03-31T00:48:25.862Z","opening":"2021-03-30T08:00:00-04:00","parkName":"Magic Kingdom","closing":"2021-03-30T21:00:00-04:00","tz":"America\/New_York","fp":false,"rides":[{"rideName":"Liberty Tree Tavern","rideWait":"-2","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_90001819","type":"RESTAURANT"},{"rideName":"Tonys Town Square Restaurant","rideWait":"-2","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_90002678","type":"RESTAURANT"},{"rideName":"The Crystal Palace","rideWait":"-2","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_90002660","type":"RESTAURANT"},{"rideName":"Cinderellas Royal Table","rideWait":"-2","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_90002464","type":"RESTAURANT"},{"rideName":"Jungle Navigation Co LTD Skipper Canteen","rideWait":"-2","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_18185631","type":"RESTAURANT"},{"rideName":"Be Our Guest Restaurant","rideWait":"-2","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_16660079","type":"RESTAURANT"},{"rideName":"The Plaza Restaurant","rideWait":"-2","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_90002670","type":"RESTAURANT"},{"rideName":"Liberty Square Market","rideWait":"-2","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_90001815","type":"RESTAURANT"},{"rideName":"Walt Disney World Railroad  Fantasyland","rideWait":"-4","fPass":"false","status":"Refurbishment","rideId":"WaltDisneyWorldMagicKingdom_16491299","type":"ATTRACTION"},{"rideName":"Walt Disney World Railroad  Frontierland","rideWait":"-4","fPass":"false","status":"Refurbishment","rideId":"WaltDisneyWorldMagicKingdom_2219610","type":"ATTRACTION"},{"rideName":"The Hall of Presidents","rideWait":"-4","fPass":"false","status":"Refurbishment","rideId":"WaltDisneyWorldMagicKingdom_80069754","type":"ATTRACTION"},{"rideName":"Walt Disney World Railroad  Main Street USA","rideWait":"-4","fPass":"false","status":"Refurbishment","rideId":"WaltDisneyWorldMagicKingdom_80010230","type":"ATTRACTION"},{"rideName":"Tomorrowland Transit Authority PeopleMover","rideWait":"-4","fPass":"false","status":"Refurbishment","rideId":"WaltDisneyWorldMagicKingdom_80010224","type":"ATTRACTION"},{"rideName":"Meet Rapunzel and Tiana at Princess Fairytale Hall","rideWait":"-1","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_17505397","type":"undefined"},{"rideName":"Meet Tinker Bell at Town Square Theater","rideWait":"-1","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_17752793","type":"undefined"},{"rideName":"Meet Mickey Mouse at Town Square Theater","rideWait":"-1","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_15850196","type":"undefined"},{"rideName":"Meet Cinderella and Elena at Princess Fairytale Hall","rideWait":"-1","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_18498503","type":"undefined"},{"rideName":"Enchanted Tales with Belle","rideWait":"-1","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_16767276","type":"ATTRACTION"},{"rideName":"Meet Daring Disney Pals as Circus Stars at Petes Silly Side Show","rideWait":"-1","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_387133","type":"undefined"},{"rideName":"Monsters Inc Laugh Floor","rideWait":"-1","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_136550","type":"ATTRACTION"},{"rideName":"Meet Ariel at Her Grotto","rideWait":"-1","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_16874126","type":"undefined"},{"rideName":"A Pirates Adventure  Treasures of the Seven Seas","rideWait":"-1","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_17272158","type":"ATTRACTION"},{"rideName":"Main Street Vehicles","rideWait":"-1","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_80010165","type":"ATTRACTION"},{"rideName":"Meet Dashing Disney Pals as Circus Stars at Petes Silly Side Show","rideWait":"-1","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_15743682","type":"undefined"},{"rideName":"Country Bear Jamboree","rideWait":"0","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80069748","type":"ATTRACTION"},{"rideName":"Walt Disneys Enchanted Tiki Room","rideWait":"0","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_16124144","type":"ATTRACTION"},{"rideName":"Sorcerers of the Magic Kingdom","rideWait":"0","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_16414579","type":"ATTRACTION"},{"rideName":"Liberty Square Riverboat","rideWait":"0","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_80010160","type":"ATTRACTION"},{"rideName":"Walt Disneys Carousel of Progress","rideWait":"0","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_80010232","type":"ATTRACTION"},{"rideName":"Swiss Family Treehouse","rideWait":"0","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010196","type":"ATTRACTION"},{"rideName":"Tom Sawyer Island","rideWait":"0","fPass":"false","status":"Closed","rideId":"WaltDisneyWorldMagicKingdom_80010220","type":"ATTRACTION"},{"rideName":"Mad Tea Party","rideWait":"5","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010162","type":"ATTRACTION"},{"rideName":"Under the Sea  Journey of The Little Mermaid","rideWait":"5","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_16767263","type":"ATTRACTION"},{"rideName":"Haunted Mansion","rideWait":"5","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010208","type":"ATTRACTION"},{"rideName":"Dumbo the Flying Elephant","rideWait":"5","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010129","type":"ATTRACTION"},{"rideName":"The Many Adventures of Winnie the Pooh","rideWait":"5","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010213","type":"ATTRACTION"},{"rideName":"Buzz Lightyears Space Ranger Spin","rideWait":"5","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010114","type":"ATTRACTION"},{"rideName":"The Barnstormer","rideWait":"10","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_16491297","type":"ATTRACTION"},{"rideName":"Jungle Cruise","rideWait":"10","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010153","type":"ATTRACTION"},{"rideName":"Tomorrowland Speedway","rideWait":"10","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010222","type":"ATTRACTION"},{"rideName":"The Magic Carpets of Aladdin","rideWait":"10","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010210","type":"ATTRACTION"},{"rideName":"Peter Pans Flight","rideWait":"15","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010176","type":"ATTRACTION"},{"rideName":"Prince Charming Regal Carrousel","rideWait":"15","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010117","type":"ATTRACTION"},{"rideName":"its a small world","rideWait":"15","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010149","type":"ATTRACTION"},{"rideName":"Pirates of the Caribbean","rideWait":"20","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010177","type":"ATTRACTION"},{"rideName":"Mickeys PhilharMagic","rideWait":"20","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010170","type":"ATTRACTION"},{"rideName":"Big Thunder Mountain Railroad","rideWait":"25","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010110","type":"ATTRACTION"},{"rideName":"Astro Orbiter","rideWait":"25","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010107","type":"ATTRACTION"},{"rideName":"Seven Dwarfs Mine Train","rideWait":"35","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_16767284","type":"ATTRACTION"},{"rideName":"Space Mountain","rideWait":"40","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010190","type":"ATTRACTION"},{"rideName":"Splash Mountain","rideWait":"80","fPass":"false","status":"Operating","rideId":"WaltDisneyWorldMagicKingdom_80010192","type":"ATTRACTION"}]}');
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
app.get('/disneyland', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[4]);
  //res.end(hstudData);
});
app.get('/californiaadventure', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[5]);
  //res.end(hstudData);
});
app.get('/universal', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[6]);
  //res.end(universaleData);
});
app.get('/island', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  //res.end(parkData[0])
  res.end(parkData[7]);
  //res.end(universalIslanData);
});
app.get('/volcanobay', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[8]);
  //res.end(universalIslanData);
});
app.get('/buschw', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[9]);
  //res.end(willBusc);
});
app.get('/swo', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[10]);
  //res.end(swodata);
});
app.get('/canwon', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[11]);
  //res.end(canData);
});
app.get('/alton', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(parkData[12]);
  //res.end(canData);
});

///////////////////////////////////////////
////Weightloss competition application////
/////////////////////////////////////////
app.get('/wlcomp', (req,res)=>{
  res.status = 200;
  res.setHeader('Content-Type', 'text/json');

  var databases = getData();
  var tInfo = returnGet(databases);
  res.end(tInfo);

});
app.post('/wlcomp', (req,res)=>{
  res.setHeader('Content-Type', 'text/json');

  var dBstuff = getData();
  var tInfo = updateWeight(dBstuff, req);

  res.status = 200;
  res.end(tInfo);
});

function getData(){
  const fs = require('fs');
  const data = fs.readFileSync('wlcomp.json');

  // parse JSON string to JSON object
  const databases = JSON.parse(data);

  return databases;
}

function returnGet(dbInfo){
  var tInfo = `[`;
  dbInfo.forEach(db =>{
    tInfo += `{"pName":"${db.pName}", "start":"${db.start}", "cur":"${db.cur}"},`;
  });
  tInfo = tInfo.substr(0,tInfo.length - 1);
  tInfo += `]`;
  return tInfo;
}

function writeToFile(tData){
  const fs = require('fs');
  fs.writeFile('wlcomp.json', tData, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('data saved!');
  });
}

function updateWeight(dBstuff, req){

  var tInfo = `[`;
  dBstuff.forEach(db => {
    if(db.pName == req.query.who){
      tInfo += `{"pName":"${db.pName}", `;
      if(req.query.type == 'start'){
        tInfo += ` "start":"${req.query.weight}", `;
        tInfo += ` "cur":"${db.cur}"},`;
      }else if(req.query.type == 'cur'){
        tInfo += ` "start":"${db.start}", `;
        tInfo += ` "cur":"${req.query.weight}"},`;  
      }
      //tInfo += ` "start":"${db.start}", "cur":"${db.cur}"},`;  
    }else{
      tInfo += `{"pName":"${db.pName}", "start":"${db.start}", "cur":"${db.cur}"},`;
    }
    
  });
  tInfo = tInfo.substr(0,tInfo.length - 1);
  tInfo += `]`;
  writeToFile(tInfo);
  return tInfo;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Telegram Bot
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.TELEGRAM_TOKEN || '1756957219:AAH5vopV3EmHJ0bWIc8Ktblcsd12IOGvKUY';
const TelegramBot = require('node-telegram-bot-api');
const options = {
  webHook: {
    port: process.env.PORT
  }
};

const url = process.env.APP_URL || `https://https://jwparktimes.herokuapp.com:${port}`;
const bot = new TelegramBot(TOKEN, options);

bot.setWebHook(`${url}/bot${TOKEN}`);

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    var info = "/info";
    if(msg.text.toString().toLowerCase().includes(info)){
        //console.log(msg);
        bot.sendMessage(msg.chat.id, `🚀 Welcome to the awesome world 🚀 \r\n @${msg.chat.first_name.toString()}`);
    }else{
        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, 'Received your message');
    }    
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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