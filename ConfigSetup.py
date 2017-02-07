import configobj

def createConfig(path):
	config = configobj.ConfigObj()
	config.filename = path
	#
	config['Room1'] = {}
	config['Room1']['PlayerUUID'] = '81ba6448-c094-4da2-8cc3-6aa4d003764b'
	config['Room1']['Haiku'] = {}
	config['Room1']['Haiku']['IP'] = '10.10.1.117'
	config['Room1']['Haiku']['Name'] = 'Drew\'s Room Fan'
	config['Room1']['Haiku']['Model'] = 'FAN'
	config['Room1']['Haiku']['Series'] = 'LSERIES'
	# Non Haiku Options
	config['debug'] = 'INFO'
	config.write()