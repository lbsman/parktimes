var waitData = (rideTimes) => {
    var tempData = '';
    rideTimes.forEach((ride) => {
        //Grab our ride name
        var rideName = ride.name.replace('"','').replace('"', '').trim().replace(/(\r\n|\n|\r)/gm, "");
        //rideName = rideName.replace('"','').replace('"', '').trim().replace(/(\r\n|\n|\r)/gm, "");
        //Grab our wait time
        var riWait = ride.waitTime;
        // console.log(rideName);
        // console.log(riWait);
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
        tempData += `{"rideName": "${rideName}", "rideWait": "${riWait}"},`
            //console.log(`${ride.name}: ${ride.waitTime} minutes wait (${ride.status})`);
    });
    return tempData;
};
var buildWorld = (name, rideTimes) => {
    var tempData = '';
    
    tempData += `{"${name}":`;
    tempData += `{"rides": [`;
    tempData += waitData(rideTimes);
    //Take our last , out 
    tempData = tempData.substring(0, tempData.length - 1);
    //Cap everything off
    tempData += `]}},`;

    return tempData;
}
var finalCleanWdw = (mData) => {
    var tempData = '';

    tempData = mData.substring(0, mData.length - 1);
    tempData += `]}`;

    return tempData;

}








module.exports = {
    waitData,
    buildWorld,
    finalCleanWdw
};