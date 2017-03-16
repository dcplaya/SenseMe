#!/usr/bin/python
from gevent import monkey														# Needed before everything else to properly patch things for websockets
monkey.patch_all()																# Part of the above comment

from flask import Flask, request, jsonify, render_template
from requests_toolbelt.multipart import decoder
import json
from pprint import pprint
import logging
from ConfigSetup import createConfig
import configobj
from pathlib import Path

# Websockets
from flask_socketio import SocketIO, emit

#For structures
from collections import namedtuple

# Logging Level Setup (INFO, DEBUG, WARNING)
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

#Import Haiku library
from Haiku.sensemefan import SenseMeFan
from Haiku.SenseMeDiscovery import SenseMeDiscovery
from Haiku.SmartHome import SmartHome

# Config File Location
configFilePath = Path("config.ini")
log.debug(configFilePath)
# Create config file if one does not exist
if configFilePath.is_file():
	log.info('Config File Already Detected')
	config = configobj.ConfigObj('config.ini')
else:
	createConfig("config.ini")

# Global values
	# ip_addr = IP Address, name = Name given to device, model = model of device, series = series of device
haiku_data = namedtuple("HaikuData", "ip_addr name model series")
room1_uuid = config['Room1']['PlayerUUID']
room1_light_status = "OFF"
room1_light_level = 0


living_room = haiku_data(ip_addr = config['Room1']['Haiku']['IP'], name = config['Room1']['Haiku']['Name'], model = config['Room1']['Haiku']['Model'], series = config['Room1']['Haiku']['Series'])
# Statically assign the fan? Probably not, but you would do it this way:
# fan = SenseMeFan('192.168.1.112', 'Living Room Fan')
#fan = SenseMeFan(living_room.ip_addr, living_room.name, living_room.model, living_room.series)

# This below will pull in a list of detected devices to later use
#testfan = SenseMeFan()
#device_list = testfan.get_device_list()
#print device_list.keys()[0]
#print 'Living Room Name: ', living_room.name
#print 'Device List:      ', device_list[living_room.name]

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/', methods=['GET', 'POST'])
def index():
	# This below will pull in a list of detected devices to later use
	#testfan = SenseMeFan()
	#device_list = testfan.get_device_list()
	#print 'Living Room Name: ', living_room.name
	#print 'Device List:      ', device_list[living_room.name]
	return render_template('index.html')
	
@app.route('/getdevicelist', methods=['GET', 'POST'])
def show_devices():
	
	# SmartHome class
	home = SmartHome()
	
	# Convert list to JSON so its easier to parse on the webpage
	return jsonify(home.HaikuDevices)

@app.route('/api/add_message/<uuid>', methods=['GET', 'POST'])
def add_message(uuid):

   #app.logger.debug("JSON received...")
   #app.logger.debug(request.json)

   # Gets the entire RAW data and prints it. JSON section is defined as "Content-Type: application/json"
   #content = request.get_data()

   # Start of semi-working code, this cuts off the event JSON value though
   payload = request.values.get('payload')
   # Converts the data back into JSON format to easily seperate out values
   json_data = json.loads(payload)
   
   # Breakout important data from the JSON
   event = json_data["event"]
   username = json_data["Account"]["title"]
   server = json_data["Server"]["title"]
   player = json_data["Player"]["title"]
   player_uuid = json_data["Player"]["uuid"]
   
   log.debug('Event: ' + event)
   log.debug('Username: ' + username)
   log.debug('Server: ' + server)
   log.debug('Player: ' + player)
   log.debug('Player UUID: ' + player_uuid)
   #print "End!"
  
   # Dim the lights if media is playing or resuming
   if ( ( event == 'media.play' ) or ( event == 'media.resume' ) ) and ( player_uuid == room1_uuid ) :
      # Get Light level before dimming
	  #print fan.getlight()
	  # Converts single quotes to double quotes to make it proper JSON
	  log.info('Getting light status/level')
	  temp_json = json.dumps(fan.getlight())
	  temp_json = json.loads(temp_json)
	  log.debug('Light Brightness: ' + temp_json["brightness"])
	  # Store the original values in variables before we start changing stuff
	  room1_light_level = temp_json["brightness"]
	  room1_light_status = temp_json["status"]
	  log.info('Dimming Lights to: ' + room1_light_level)
	
   # Resume the lights if media is stopped or paused
   if ( ( event == 'media.stop' ) or ( event == 'media.pause' ) ) and ( player_uuid == room1_uuid ) :
      # Get Light level
	  log.info('Resuming Lights')
	  light = fan.getlight()
	
   return jsonify({"uuid":uuid})
  
#===============================================================================
# Websocket messages. All websocket connections will go below here
#===============================================================================
@socketio.on('devicestatus')
def devicestatus(message):
    #===========================================================================
    # 
    # Receives a message, on `devicestatus`, and emits to the same channel.
    # 
    #===========================================================================
    log.debug("[x] Received\t: " + message)
    json_data = json.loads(message.decode('string-escape').strip('"'))			#Strips out the bad stuff from the string before cnoverting it to JSON object
    log.debug("Device Status JSON Data: ", json_data)
    name = json_data['Name']													# Grabs all the values from the JSON file
    ip = json_data['IP']
    series = json_data['Series']
    model = json_data['Model']
    mac = json_data['MAC']
    
    # Send the data to sensemfan.py to get status updates on the device
    device = SenseMeFan(ip, name, model, series, mac)
    fanStatus = device.getfan()
    lightStatus = device.getlight()

	# Send the resulting data back to the web page to display it    
    deviceStatus = {}
    deviceStatus["light"] = lightStatus
    deviceStatus["fan"] = fanStatus

    log.info("Device Status Reported: " + str(deviceStatus))
    
    server_message = deviceStatus									
    emit("devicestatus", server_message)

#===============================================================================
# End devicestatus websocket code
#===============================================================================
   
@socketio.on('devicecontrol')
def devicecontrol(message):
    #===========================================================================
    # 
    # Receives a message, on `devicecontrol`, and emits to the same channel.
    # 
    #==========================================================================
    log.debug("[x] Received\t: " + message)
    json_data = json.loads(message.decode('string-escape').strip('"'))			#Strips out the bad stuff from the string before cnoverting it to JSON object
    log.debug("Device Control JSON Data: ", json_data)
    mac = str(json_data['MAC'])													# Grabs all the values from the JSON file
    model = str(json_data['Model'])
    series = str(json_data['Series'])
    name = str(json_data['Name'])
    ip = str(json_data['IP'])
    lightPower = str(json_data['Light']['Power'])
    lightBrightness = str(json_data['Light']['Brightness'])
    lightHue = str(json_data['Light']['Hue'])
    fanPower = str(json_data['Fan']['Power'])
    fanSpeed = str(json_data['Fan']['Speed'])
    	
	#===========================================================================
	# The following needs to happen
	# 1) Get current status of devicecontrol
	# 2) Store status
	# 3) Compare status with request
	# 4) Send request if current status is different
	#===========================================================================

	# 1) Get the current status
    device = SenseMeFan(ip, name, model, series, mac)							
    currentFanStatus = device.getfan()
    currentLightStatus = device.getlight()
 
 	# 2) Store the status	
    currentLightPower = str(currentLightStatus["status"])
    currentLightBrightness = str(currentLightStatus["brightness"])
    currentFanPower = str(currentFanStatus["status"])
    currentFanSpeed = str(currentFanStatus["speed"])
    
    # 3) Compare status with request
    #===========================================================================
    # Light Controls
    #===========================================================================
    if currentLightPower == lightPower:
    	# Do nothing
    	log.debug("Light request and status the same, doing nothing")
    elif lightPower == "ON":
		# Send on command
		log.debug("Light ON command sent to: ", name)
		device.lighton()
    elif lightPower == "OFF":
		# Send off command
		log.debug("Light OFF command sent to: ", name)
		device.lightoff()
    elif lightPower == "TOGGLE":
		# Send toggle command
		log.debug("Light TOGGLE command sent to: ", name)
		device.lighttoggle()
    elif lightPower == "":
		# No command to turn on the light, doing nothing
		log.debug("Light control command missing, doing nothing")
	

    if currentLightBrightness == lightBrightness:
		# Do nothing
		log.debug("Light request and status the same, doing nothing")
    elif lightBrightness == "INCREASE":
		# Send increase command
		log.debug("Light brightness increase command sent to: " + name)
		device.inclight()
    elif lightBrightness == "DECREASE":
		# Send decrease command
		log.debug("Light brightness decrease command sent to: " + name)
		device.declight()
    elif lightBrightness =="":
    	# No command for light brightness, do nothing
    	log.debug("Light brightness command missing, doing nothing")
    else:
		# Send command to set brightness exactly
		log.debug("Light brightness set to " + lightBrightness + " for " + name)
		device.setlight(lightBrightness)
	
	#===========================================================================
	# Fan Controls	
	#===========================================================================
    if currentFanPower == fanPower:
		# Do nothing
		log.debug("Fan request and status the same, doing nothing")
    elif fanPower == "ON":
		# Send on command
		log.debug("Fan ON command sent to: " + name)
		device.fanon()
    elif fanPower == "OFF":
		# Send off command
		log.debug("Fan OFF command sent to: " + name)
		device.fanoff()
    elif fanPower == "TOGGLE":
		# Send off command
		log.debug("Fan TOGGLE command sent to: " + name)
		device.fantoggle()
		
    if currentFanSpeed == fanSpeed:
		# Do nothing
		log.debug("Fan request and status the same, doing nothing")
    elif fanSpeed == "INCREASE":
		# Send increase command
		log.debug("Fan speed increase command sent to: " + name)
		device.incspeed()
    elif fanSpeed == "DECREASE":
		# Send decrease command
		log.debug("Light brightness decrease command sent to: " + name)
		device.decspeed()
    elif fanSpeed =="":
		# No command for light brightness, do nothing
		log.debug("Fan speed command missing, doing nothing")
    else:
		# Send command to set brightness exactly
		log.debug("Fan speed set to " + fanSpeed + " for " + name)
		device.setspeed(fanSpeed)
	
#===============================================================================
# End devicecontrol websocket code
#===============================================================================

if __name__ == '__main__':
	# Run the webserver
	app.debug = False
	socketio.run(app, port=8088, host= '0.0.0.0')
	
