const http = require('http');
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

const hostname = '127.0.0.1';
const port = 3000;
var disneyData;

const CheckWaitTimes = () => {
  DisneyWorldMagicKingdom.GetWaitTimes().then((rideTimes) => {
    disneyData = `{"rides": [`
      rideTimes.forEach((ride) => {
        //Grab our ride name
        var rideName = ride.name.replace('"','').replace('"', '').trim().replace(/(\r\n|\n|\r)/gm, "");
        //rideName = rideName.replace('"','').replace('"', '').trim().replace(/(\r\n|\n|\r)/gm, "");
        //Grab our wait time
        var riWait = ride.waitTime;
        //if its temporairly unavailable let me know as well
        if(rideName.indexOf('Temporarily Unavailable') > 0 ){
          rideName = rideName.replace(' - Temporarily Unavailable', '').trim();
          riWait = -1;
        }
        //console.log(riWait);
        //If it just doesnt have a time let me know
        if(riWait == null){
          riWait = -2;
        }
        //Form the main section
        disneyData += `{"rideName": "${rideName}", "rideWait": "${riWait}"},`
          //console.log(`${ride.name}: ${ride.waitTime} minutes wait (${ride.status})`);
      });
    //Take our last , out 
    disneyData = disneyData.substring(0, disneyData.length - 1);
    //Cap everything off
    disneyData += `]}`;
  }).catch((error) => {
      console.error(error);
  }).then(() => {
      setTimeout(CheckWaitTimes, 1000 * 60 * 5); // refresh every 5 minutes
  });
  
};

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  // Access wait times by Promise
    
    console.log(disneyData);
    

    res.setHeader('Content-Type', 'text/plain');
    res.end(disneyData);
  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  CheckWaitTimes();
});