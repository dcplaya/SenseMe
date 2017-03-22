///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//This function will be run when a user clicks on a row in the table
function deviceClickedInTable(name, ip, model, series, mac) {

    // Start the status update request
    deviceStatusUpdateStart(name, ip, model, series, mac);
}

// Start requesting device status updates and set the onClick for the links
function deviceStatusUpdateStart(name, ip, model, series, mac) {

    var client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","Model":"' + model + '","Series":"' + series + '","MAC":"' + mac + '"}');
    window.clearInterval(window.refreshIntervalID);                             // Stops the previous setInterval so I dont spam status update requests
    
    // Sends the command every X seconds
    window.refreshIntervalID = window.setInterval(function() {
        socket.emit("devicestatus", client_message);
    //console.log("[x] Sent: " + client_message);
    }, 1000);
    
    //Once row is selected, change the onclick values of the device control to send the clicked device properly
    document.getElementById("deviceLightToggle").setAttribute('onclick', 'deviceLightToggle("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    document.getElementById("deviceLightOn").setAttribute('onclick', 'deviceLightOn("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    document.getElementById("deviceLightOff").setAttribute('onclick', 'deviceLightOff("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    document.getElementById("deviceLightIncrease").setAttribute('onclick', 'deviceLightIncrease("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    document.getElementById("deviceLightDecrease").setAttribute('onclick', 'deviceLightDecrease("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    // Now do the same thing as above but for the fan
    document.getElementById("deviceFanToggle").setAttribute('onclick', 'deviceFanToggle("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    document.getElementById("deviceFanOn").setAttribute('onclick', 'deviceFanOn("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    document.getElementById("deviceFanOff").setAttribute('onclick', 'deviceFanOff("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    document.getElementById("deviceFanIncrease").setAttribute('onclick', 'deviceFanIncrease("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
    document.getElementById("deviceFanDecrease").setAttribute('onclick', 'deviceFanDecrease("' + name +'", "' + ip + '", "' + model + '", "' + series + '", "' + mac + '")');
   
   // Return refreshID so I can kill it later on properly
   return refreshIntervalID;  
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//These functions will be run whenever a device control link is clicked
// Standard JSON format to control devices will be
// {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}

////////////////////////////////////////////////////////////////////////////////
//                          Start light control functions
////////////////////////////////////////////////////////////////////////////////
function deviceLightToggle(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    var client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"TOGGLE", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":""' + '}}');
    console.log("Device Light On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
}

function deviceLightOn(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    var client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"ON", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":""' + '}}');
    console.log("Device Light On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
}

function deviceLightOff(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    var client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"OFF", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":""' + '}}');
    console.log("Device Light On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
}

function deviceLightIncrease(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    var client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"INCREASE", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":""' + '}}');
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
}

function deviceLightDecrease(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    var client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"DECREASE", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":""' + '}}');
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
}
////////////////////////////////////////////////////////////////////////////////
//                          End light control functions
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//                          Start fan control functions
////////////////////////////////////////////////////////////////////////////////
function deviceFanToggle(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    var client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"TOGGLE", "Speed":""' + '}}');
    //console.log("Device Fan On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
}

function deviceFanOn(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    var client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"ON", "Speed":""' + '}}');
    //console.log("Device Fan On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
}

function deviceFanOff(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    var client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"OFF", "Speed":""' + '}}');
    //console.log("Device Fan On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
}

function deviceFanIncrease(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    var client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":"INCREASE"' + '}}');
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
}

function deviceFanDecrease(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    var client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":"DECREASE"' + '}}');
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
}

////////////////////////////////////////////////////////////////////////////////
//                          End fan control functions
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//                          Start database update functions
//  This function will signal the server to find new devices and store them in
//  the sqlite3 database
////////////////////////////////////////////////////////////////////////////////
function databaseUpdateDevices() {
   var client_message = JSON.stringify('{"Command":"update"}');  
   socket.emit('databaseupdatedevices', client_message);    
}

////////////////////////////////////////////////////////////////////////////////
//                          End database update functions
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//                 Start database get list of devices functions
//  This function will grab the list of devices at page load and whenever
//  the list needs to be refreshed on screen
////////////////////////////////////////////////////////////////////////////////
function databaseGetListOfDevices() {
    // Start the section that loads the other table, this should be a much better loader than what I wrote
     $(document).ready(function(e) {
        $.getJSON('getdevicelist', function(data) {
            var data1 = [];
            for ( var key in data ) {
               data1.push( {name: data[key].Name, ip: data[key].IP, model: data[key].Model, series: data[key].Series, mac: data[key].MAC} );
               //console.log(data1);
           }
            var dt = dynamicTable.config('data-table', 
                        ['name', 'ip', 'model', 'series', 'mac'], 
                        ['Name', 'IP Address', 'Model', 'Series', 'Mac Address'], //set to null for field names instead of custom header names
                        'There are no items to list...');
            dt.load(data1);
        
            
        });
    });
    
}

////////////////////////////////////////////////////////////////////////////////
//                          End database get list of devices functions
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//                          Start websocket setup
////////////////////////////////////////////////////////////////////////////////

function setupWebsocket() {
    // Set up the receiving of the websocket as soon as possible
    var WEB_SOCKET_SWF_LOCATION = "/static/WebSocketMain.swf";
    var WEB_SOCKET_DEBUG = true;
    var socket = io.connect('http://' + document.domain + ':' + location.port);
}

////////////////////////////////////////////////////////////////////////////////
//                          End websocket setup
////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This section will be for javascript that constantly runs once page is loaded, such as device status

// Used to stop the previous setInterval so I am not spamming the devices
var refreshIntervalID;
var WEB_SOCKET_SWF_LOCATION = "/static/WebSocketMain.swf";
var WEB_SOCKET_DEBUG = true;
var socket = io.connect('http://' + document.domain + ':' + location.port);

//function displayStatus() {
    socket.on('devicestatus', function(message) {
        console.log("[x] Received    : " + message);
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
//}

//window.onload = displayStatus();
// Refresh the device list every 1 seconds
window.setInterval(databaseGetListOfDevices, 1000);

// Code that runs constantly. Needed to identify what the IP address is of the row that was clicked
$("#data-table").on("click", "tr", function(e) {
    var name = $(this).find('td:eq(0)').text();
    var ip = $(this).find('td:eq(1)').text();
    var model = $(this).find('td:eq(2)').text();
    var series = $(this).find('td:eq(3)').text();
    var mac = $(this).find('td:eq(4)').text();
    deviceClickedInTable(name, ip, model, series, mac);
});




// END