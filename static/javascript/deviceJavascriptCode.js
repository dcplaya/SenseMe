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
};

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
    client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"TOGGLE", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":""' + '}}');
    console.log("Device Light On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

function deviceLightOn(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"ON", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":""' + '}}');
    console.log("Device Light On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

function deviceLightOff(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"OFF", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":""' + '}}');
    console.log("Device Light On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

function deviceLightIncrease(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"INCREASE", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":""' + '}}');
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

function deviceLightDecrease(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"DECREASE", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":""' + '}}');
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};
////////////////////////////////////////////////////////////////////////////////
//                          End light control functions
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//                          Start fan control functions
////////////////////////////////////////////////////////////////////////////////
function deviceFanToggle(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"TOGGLE", "Speed":""' + '}}');
    //console.log("Device Fan On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

function deviceFanOn(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"ON", "Speed":""' + '}}');
    //console.log("Device Fan On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

function deviceFanOff(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"OFF", "Speed":""' + '}}');
    //console.log("Device Fan On String: ", client_message);
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

function deviceFanIncrease(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":"INCREASE"' + '}}');
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

function deviceFanDecrease(name, ip, model, series, mac) {

    // Standard JSON format to control devices will be
    // {MAC: mac, Model: model, Series: series, Light: { Power: on/off/toggle, Brightness: 0-16/INCREASE/DECREASE, Hue: ?? }, Fan: { Power: on/off/toggle, Speed: 0-7/INCREASE/DECREASE }}
    client_message = JSON.stringify('{"Name":"' + name + '","IP":"' + ip + '","MAC":"' + mac + '","Model":"' + model + '","Series":"' + series + '","Light": {"Power":"", "Brightness":"", "Hue":"" }' + ',"Fan": {"Power":"", "Speed":"DECREASE"' + '}}');
    // Send request
    socket.emit("devicecontrol", client_message);
    
    return false;                                                               
};

////////////////////////////////////////////////////////////////////////////////
//                          End fan control functions
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//                          Start database update functions
//  This function will signal the server to find new devices and store them in
//  the sqlite3 database
////////////////////////////////////////////////////////////////////////////////
function databaseUpdateDevices() {
   client_message = JSON.stringify('{"Command":"update"}');  
   socket.emit('databaseupdatedevices', client_message);    
};

////////////////////////////////////////////////////////////////////////////////
//                          End database update functions
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//                 Start database get list of devices functions
//  This function will grab the list of devices at page load and whenever
//  the list needs to be refreshed on screen
////////////////////////////////////////////////////////////////////////////////
function databaseGetListOfDevices() {
    var table = document.getElementById("DeviceTable");                         // Selects which table by ID
    var i = 0;                                                                  // Inializes the counter to 0   
    // Clear table before refreshing it
    for ( var q = table.rows.length - 1; q > 0; q--) {
        table.deleteRow(q);
    }
    $.getJSON('getdevicelist', function(data) {
        for ( var key in data ) {                                               // Starts filling in the rest of the table based on the JSON data
            row = table.insertRow(i+1);
            cellName = row.insertCell(i);
            cellIP = row.insertCell(i+1);
            cellModel = row.insertCell(i+2);
            cellSeries = row.insertCell(i+3);
            cellMAC = row.insertCell(i+4);
            cellName.innerHTML = data[key]["Name"];
            cellIP.innerHTML = data[key]["IP"];
            cellModel.innerHTML = data[key]["Model"];
            cellSeries.innerHTML = data[key]["Series"];
            cellMAC.innerHTML = data[key]["MAC"];
            //console.log(cellName.innerHTML);
            deviceName = cellName.innerHTML;
            deviceIP = cellIP.innerHTML;
            deviceModel = cellModel.innerHTML;
            deviceSeries = cellSeries.innerHTML;
            deviceMAC = cellMAC.innerHTML;
            row.setAttribute('onclick', 'deviceClickedInTable("' + deviceName +'", "' + deviceIP + '", "' + deviceModel + '", "' + deviceSeries + '", "' + deviceMAC + '")' );       // Sets the row onclick attribute to pass into the function to save the data
        }         
    });  
};

////////////////////////////////////////////////////////////////////////////////
//                          End database get list of devices functions
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//                 Start webpage table setup
//  This fuction just sets up the device table
////////////////////////////////////////////////////////////////////////////////
function setupDeviceTable() {
    var table = document.getElementById("DeviceTable");                             // Selects which table by ID
    var i = 0;                                                                      // Inializes the counter to 0
    var header = table.createTHead();                                               // Sets up the header of the columns
    var row = header.insertRow(i);                                                  // Inserts header row
    var cellName = row.insertCell(i);                                               // Inserts the 1st cell
    var cellIP = row.insertCell(i+1);                                               // Inserts 2nd cell
    var cellModel = row.insertCell(i+2);                                            // etc
    var cellSeries = row.insertCell(i+3);                   
    var cellMAC = row.insertCell(i+4);
    cellName.innerHTML = "<b>Name</b>";                                             // Makes the 1st row a bunch of bold text
    cellIP.innerHTML = "<b>IP Address</b>";
    cellModel.innerHTML = "<b>Model</b>";
    cellSeries.innerHTML = "<b>Series</b>";
    cellMAC.innerHTML = "<b>MAC Address</b>";
    table.style.border = "thin solid black";
    table.style.backgroundColor='#BCD4EC';                                                                  // Inializes the counter to 0
};

////////////////////////////////////////////////////////////////////////////////
//                          End database get list of devices functions
////////////////////////////////////////////////////////////////////////////////

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
window.onload = setupDeviceTable();
//window.onload = databaseGetListOfDevices();
// Refresh the device list every 1 seconds
window.setInterval(databaseGetListOfDevices, 1000);






// END