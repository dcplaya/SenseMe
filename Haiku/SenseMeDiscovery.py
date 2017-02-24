###############################################################################
## This class is an attempt to split apart the discovery service from        ##
## sensemefan.py. This should allow me to have a class definition for each   ##
## device that it discovers.                                                 ##
###############################################################################

# Required modules to import
import socket
import re
import time

# Class definition starts here!
class SenseMeDiscovery:
    device_list = {}                                                            # Dictionary list of all detected Haiku devices 
    
    def __init__(self):
        self.PORT = 31415                                                       # This is a hard coded port from Haiku
        self.discover()      
        
    def discover(self):                                                         # Discover all devices on the network and return the value eventually
        data = '<ALL;DEVICE;ID;GET>'.encode('utf-8')

        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.bind(('', 0))
        s.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        
        res = s.sendto(data, ('<broadcast>', self.PORT))

        p = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        p.setblocking(0)
        p.settimeout(5.0)
        killWhile = False
        i = 0
        socket_data = []
        
        try:
            p.bind(('', 31415))
        except:
            print 'Failed To Bind To Socket'
            p.close()
            raise
            p.blocking(0)
        while killWhile != True:
            try:
                m = p.recvfrom(2048)
                if m:
                    print 'Data recevied'
                    socket_data.append(m)
            except socket.timeout:
                killWhile = True
        if not socket_data[0]:
            p.close()    # Closes the open socket
            pass
        else:
            
            # Interate through the entire list to parse out the info into a dict
            for i  in range (0, len(socket_data)):                                         # Loop until it reaches the end of the list
                m = socket_data[i]                                                         # Put the data into a working variable
                self.details = m[0].decode('utf-8')                                        # Decode/Convert to UTF-8
                res = re.match('\((.*);DEVICE;ID;(.*);(.*),(.*)\)',self.details)           # Regular expression to parse the info
                self.name = res.group(1)                                                   # Pull the name of the device out of the reg expression
                self.mac = res.group(2)                                                    # Pull the MAC ID of the device out of the reg expression
                self.model = res.group(3)                                                  # Pull the model of the device out of the reg expression
                self.series = res.group(4)                                                 # Pull the series of the device out of the reg expression
                self.ip = m[1][0]                                                          # Pull the IP of the device from the 2nd half of the response
            
                # Start storing the info into a dict
                SenseMeDiscovery.device_list[self.name] = self.name
                SenseMeDiscovery.device_list[self.name] = {}                                                # Needed to initalize a new dict inside of a dict
                SenseMeDiscovery.device_list[self.name]["MAC"] = self.mac
                SenseMeDiscovery.device_list[self.name]["Model"] = self.model
                SenseMeDiscovery.device_list[self.name]["Series"] = self.series
                SenseMeDiscovery.device_list[self.name]["IP"] = self.ip
            # Store all the data in a list
            p.close()    # Closes the open socket
            #print('ip: ' + self.ip)
            #print('details: ' + self.details)
            #print(self.name)
            pass
   
    def get_device_list(self):
        # Returns a dictionary of all devices detected
        return SenseMeDiscovery.device_list
    