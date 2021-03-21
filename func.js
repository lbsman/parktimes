var waitData = (rideTimes) => {
    var tempData = '';
    //console.log(rideTimes);
    //rideTimes.sort(function(a, b){return b-a});

    rideTimes = rideTimes.sort((a, b) => {
        if (a.waitTime > b.waitTime) { return 1; }
        if (b.waitTime > a.waitTime) { return -1; }
        return 0;
    })


    //console.log(rideTimes);
    rideTimes.forEach((ride) => {
        //Grab our ride name
        var rideName = ride.name.replace('"','').replace('"', '').trim().replace(/(\r\n|\n|\r)/gm, "").replace(/[^\w\s]/gi, '');
        //rideName = rideName.replace('"','').replace('"', '').trim().replace(/(\r\n|\n|\r)/gm, "");
        //Grab our wait time
        var riWait = ride.waitTime;
        // console.log(rideName);
        // console.log(riWait);
        //if its temporairly unavailable let me know as well
        if(rideName.indexOf('Temporarily Unavailable') > 0 ){
            rideName = rideName.replace(' Temporarily Unavailable', '').trim();
            riWait = -1;   
        }
        //console.log(riWait);
        //If it just doesnt have a time let me know
        if(riWait == null){
            riWait = -2;
        }
        //Form the main section
        tempData += `{"rideName": "${rideName}", "rideWait": "${riWait}"},`
            //console.log(`${ride.name}: ${ride.waitTime} minutes wait (${ride.status})`);
    });
    return tempData;
};
var buildWorld = (rideTimes, oTime, cTime, tz, fp) => {
    var tempData = '';
    
    tempData += `{"opening": "${oTime}", "closing": "${cTime}", "tz": "${tz}", "fp": ${fp}, "rides": [`;
    tempData += waitData(rideTimes);
    //Take our last , out 
    tempData = tempData.substring(0, tempData.length - 1);
    tempData = finalCleanWdw(tempData);
    return tempData;
}
var finalCleanWdw = (mData) => {
    var tempData = '';

    tempData = mData.substring(0, mData.length - 1);
    tempData += `}]}`;

    return tempData;
}






module.exports = {
    waitData,
    buildWorld,
    finalCleanWdw
};