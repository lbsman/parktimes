var waitData = (rideTimes) => {
    var tempData = '';
    //sconsole.log(rideTimes);
    //rideTimes.sort(function(a, b){return b-a});
    
    rideTimes = cleanNames(rideTimes);

    rideTimes = rideTimes.sort((a, b) => {
        if (a.waitTime > b.waitTime) { return 1; }
        if (b.waitTime > a.waitTime) { return -1; }
        return 0;
    })

    return makeStuff(rideTimes);
};
var buildWorld = (rideTimes, oTime, cTime, tz, fp) => {
    var tempData = '';
    let date_ob = new Date();
    tempData += `{"updateTime": "${date_ob}", "opening": "${oTime}", "closing": "${cTime}", "tz": "${tz}", "fp": ${fp}, "rides": [`;
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
function cleanNames(rideTimes){
    rideTimes.forEach((ride) => {
        //Grab our ride name
        ride.name = ride.name.replace('"','').replace('"', '').trim().replace(/(\r\n|\n|\r)/gm, "").replace(/[^\w\s]/gi, '');
        //if its temporairly unavailable let me know as well
        if(ride.name.indexOf('Temporarily Unavailable') > 0 ){
            ride.name = ride.name.replace(' Temporarily Unavailable', '').trim();
            ride.waitTime = -1;   
        }
        //console.log(riWait);
        //If it just doesnt have a time let me know
        if(ride.waitTime == null){
            ride.waitTime = -2;
        }
    });
    return rideTimes;
}
function makeStuff(tData){
    var tempData = '';
    tData.forEach((ride) => {
        //Form the main section
        tempData += `{`;
        tempData += `"rideName": "${ride.name}",`;
        tempData += `"rideWait": "${ride.waitTime}",`;
        tempData += `"fPass": "${ride.fastPass}",`;
        tempData += `"status": "${ride.status}"`;
        tempData += `},`;
    });

    return tempData;
}





module.exports = {
    waitData,
    buildWorld,
    finalCleanWdw
};