from flask import Flask, request, jsonify
from requests_toolbelt.multipart import decoder
import json
from pprint import pprint

#For structures
from collections import namedtuple

#Import Haiku library
from sensemefan import SenseMeFan


# Global values
	# ip_addr = IP Address, name = Name given to device, model = model of device, series = series of device
haiku_data = namedtuple("HaikuData", "ip_addr name model series")
room1_uuid = '81ba6448-c094-4da2-8cc3-6aa4d003764b'
room1_light_status = "OFF"
room1_light_level = 0

living_room = haiku_data(ip_addr = "10.10.1.117", name = "Drew\'s Room Fan", model = "FAN", series = "LSERIES")
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
   
   #print "Event: " + event
   #print "Username: " + username
   #print "Server: " + server
   #print "Player: " + player
   #print "Player UUID: " + player_uuid
   #print "End!"
  
   # Dim the lights if media is playing or resuming
   if ( ( event == 'media.play' ) or ( event == 'media.resume' ) ) and ( player_uuid == room1_uuid ) :
      # Get Light level before diming
	  #print fan.getlight()
	  # Converts single quotes to double quotes to make it proper JSON
	  print "Getting light status/level"
	  temp_json = json.dumps(fan.getlight())
	  temp_json = json.loads(temp_json)
	  #print temp_json["brightness"]
	  # Store the original values in variables before we start changing stuff
	  room1_light_level = temp_json["brightness"]
	  room1_light_status = temp_json["status"]
	  print "Dimming Lights"
	
   # Resume the lights if media is stopped or paused
   if ( ( event == 'media.stop' ) or ( event == 'media.pause' ) ) and ( player_uuid == room1_uuid ) :
      # Get Light level
	  print "Resuming Lights"
	  light = fan.getlight()
	
   return jsonify({"uuid":uuid})

if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=8088, debug=True)
