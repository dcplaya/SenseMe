###############################################################################
## This is my attempt at making a class that will house all Haiku devices    ##
## and will be used like SmartHome.Fan.DimLights() maybe? Not sure if thats  ##
## the most correct way to do this                                           ##
###############################################################################

from Haiku.SenseMeDiscovery import SenseMeDiscovery
from Haiku.sensemefan import SenseMeFan

class SmartHome:
    HaikuDevices = {}                                                           # Initalize dictionary
    SenseMeDevices = []                                                         # Initalize dictionary of sensemefan devices
    
    def __init__(self):
        discover = SenseMeDiscovery()                                           # Create a object of the SenseMeDiscovery class
        SmartHome.HaikuDevices = discover.get_device_list()                     # Store the list of all devices
        
        # What I need to do
        # Iterate over the HaikuDevices dictionary to make a new object
        # for each discovered device. 
        
        # For 0 --> End Of list
            # device[i] = sensemefan(HaikuDevices[i][IP], HaikuDevices[i], HaikuDevices[i][Model], HaikuDevices[i][Series])
        # End If

        # Empty list if it has any data in it at all
        if not ( len(SmartHome.SenseMeDevices) == 0 ):
            #print 'Delete List Length Of: ', len(SmartHome.SenseMeDevices) 
            del SmartHome.SenseMeDevices[:]
            
        # Trying to store a list of SenseMeFan devices....Not sure if this works   
        for key in SmartHome.HaikuDevices:
            #print 'List is empty, store objects'
            #print SmartHome.HaikuDevices[key]
            SmartHome.SenseMeDevices.append(SenseMeFan(SmartHome.HaikuDevices[key]["IP"], SmartHome.HaikuDevices[key]["Name"], SmartHome.HaikuDevices[key]["Model"], SmartHome.HaikuDevices[key]["Series"], SmartHome.HaikuDevices[key]["MAC"]))
            
        #=======================================================================
        # # Prints the state of each item in the list    
        # for x in SmartHome.SenseMeDevices:
        #     print(x.getstate())
        #=======================================================================
        