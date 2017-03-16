# SenseMe Web app
Python webpage for Haiku SenseMe devices controlled fans/lights

The end result of this will be to run this web app to allow direct control via webpage to all detected devices and show the status of the devices.



Things people can help with (Or future improvements I want to make)
0) Set up the python libraries correctly so they are easily installed with 1 command
1) A way to open a port and monitor it for all BROADCAST messages so I do not have to constantly spam devices for their status
2) Store all detected devices in a database and update that database when the refresh button is pushed on webpage. This will hopefully get around the fact that many times not all devices are detected
3) Integrate a page to setup control of Plex and the lights. Prelim stuff is there, I just need to finish it
4) Change the webpage over to show all devices and the status (once 1 and 2 are complete)
5) Allow user to manually enter IP/MAC of device and have the app go out and pull the remaining info it needs from the device, then store this in the database
6) Sniff more commands such as hue of the lights, motion settings and more
7) Log data, fan/light status, motion detection, temperature, and whatever else I can grab. Store this in a database too so I can look at histories

See the README under the Haiku folder for more info on where I got the original library

I'm new to Python/Javascript/HTML, so there are probably poor coding standards in places, I'm sorry for that.

This is in no way affiliated with Haiku/BigAssFans

## Usage
  
   Need to put usage here. Right now just run the HaikuLightControlPlexServer.py