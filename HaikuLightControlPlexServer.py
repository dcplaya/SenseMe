from flask import Flask, request, jsonify
from requests_toolbelt.multipart import decoder
import json
from pprint import pprint
import logging
from ConfigSetup import createConfig
import configobj
from pathlib import Path

#For structures
from collections import namedtuple

#Import Haiku library
from sensemefan import SenseMeFan

# Logging Level Setup (INFO, DEBUG, WARNING)
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

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
fan = SenseMeFan(living_room.ip_addr, living_room.name, living_room.model, living_room.series)

app = Flask(__name__)

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
      # Get Light level before diming
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

if __name__ == '__main__':
	# Run the webserver
	app.run(host= '0.0.0.0', port=8088, debug=True)
