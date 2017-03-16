///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//This function will be run when a user clicks on a row in the table
function deviceClickedInTable(name, ip, model, series, mac) {

    // Start the status update request
    deviceStatusUpdateStart(name, ip, model, series, mac);
};

// Start requesting device status updates and set the onClick for the links
function deviceStatusUpdateStart(name, ip, model, series, mac) {

    client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","Model":"' + model + '","Series":"' + series + '","MAC":"' + mac + '"}');
    
    window.clearInterval(window.refreshIntervalID);                             // Stops the previous setInterval so I dont spam status update requests
    
    // Sends the command every X seconds
    window.refreshIntervalID = window.setInterval(function() {
        socket.emit("devicestatus", client_message);
    //console.log("[x] Sent: " + client_message);
    }, 5000);
    
    //Once row is selected, change the onclick values of the device control to send the clicked device properly
    document.getElementById("deviceLightToggle").setAttribute('onclick', 'deviceLightToggle("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    document.getElementById("deviceLightOn").setAttribute('onclick', 'deviceLightOn("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    document.getElementById("deviceLightOff").setAttribute('onclick', 'deviceLightOff("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    document.getElementById("deviceLightIncrease").setAttribute('onclick', 'deviceLightIncrease("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    document.getElementById("deviceLightDecrease").setAttribute('onclick', 'deviceLightDecrease("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
   
   // Return refreshID so I can kill it later on properly
   return refreshIntervalID;  
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//These functions will be run whenever a device control link is clicked
// Standard JSON format to control devices will be
// {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Level: 0-10, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-10 }}

function deviceLightToggle(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Level: 0-10, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-10 }}
    client_message = JSON.stringify('{"MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": { "Power":"TOGGLE", "Level":"10", "Hue":"0" }' + ',"Fan": { "Power":"OFF", "Speed":"0"' + '"}');
    console.log("Device Light On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

function deviceLightOn(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Level: 0-10, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-10 }}
    client_message = JSON.stringify('{"MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": { "Power":"ON", "Level":"10", "Hue":"0" }' + ',"Fan": { "Power":"OFF", "Speed":"0"' + '"}');
    console.log("Device Light On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

function deviceLightOff(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Level: 0-10, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-10 }}
    client_message = JSON.stringify('{"MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": { "Power":"OFF", "Level":"10", "Hue":"0" }' + ',"Fan": { "Power":"OFF", "Speed":"0"' + '"}');
    console.log("Device Light On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

function deviceLightIncrease(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Level: 0-10, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-10 }}
    //client_message = JSON.stringify('{"MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": { "Power":"OFF", "Level":"10", "Hue":"0" }' + ',"Fan": { "Power":"OFF", "Speed":"0"' + '"}');
    console.log("Not Yet Implemented");
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

function deviceLightDecrease(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Level: 0-10, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-10 }}
    //client_message = JSON.stringify('{"MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": { "Power":"OFF", "Level":"10", "Hue":"0" }' + ',"Fan": { "Power":"OFF", "Speed":"0"' + '"}');
    console.log("Not Yet Implemented");
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This section will be for javascript that constantly runs once page is loaded, such as device status

// Set up the receiving of the websocket as soon as possible
WEB_SOCKET_SWF_LOCATION = "/static/WebSocketMain.swf";
WEB_SOCKET_DEBUG = true;
socket = io.connect('http://' + document.domain + ':' + location.port);

// Used to stop the previous setInterval so I am not spamming the devices
var refreshIntervalID;

function displayStatus() {
    socket.on('devicestatus', function(message) {
        //console.log("[x] Received    : " + message);
        var status = JSON.stringify(message);
        //console.log("Message Data: " + message.light.status);
        
        var $jqLightStatus = $('.jqLightStatus');                               // Defines a variable and points it to the HTML span class name
        var $jqLightBrightness = $('.jqLightBrightness');                       // Defines a variable and points it to the HTML span class name
        var $jqFanStatus = $('.jqFanStatus');                                   // Defines a variable and points it to the HTML span class name
        var $jqFanSpeed = $('.jqFanSpeed');                                     // Defines a variable and points it to the HTML span class name
        $jqLightStatus.html(message.light.status);                              // Overwrites the HTML text with the value of the variable
        $jqLightBrightness.html(message.light.brightness);                      // Overwrites the HTML text with the value of the variable
        $jqFanStatus.html(message.fan.status);                                  // Overwrites the HTML text with the value of the variable
        $jqFanSpeed.html(message.fan.speed);                                    // Overwrites the HTML text with the value of the variable
    });
};

window.onload = displayStatus;