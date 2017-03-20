#Code to store a list of all devices detected to allow for faster discovery

# Import SQLite
import sqlite3
from sqlite3 import Error

class haiku_database:    
    
    # Create a connection/file
    def create_connection(self, db_file):
        """create a database connection to the SQLite database specified by db_file
        :param db_file: database file
        :return: Connection object or None
        """
        try: 
            conn = sqlite3.connect(db_file)
            return conn
        except Error as e:
            print("Error Create Connection: ", e)
          
        
        return None
    
    # Create a table
    def create_table(self, conn, create_table_sql):
        """ create a table from the create_table_sql statement along with the requried device data fields with MAC being the primary key
        :param conn: Connection object
        :param create_table_sql: a CREATE TABLE statement
        :return:
        """
        try:
            c = conn.cursor()
            c.execute(''' CREATE TABLE IF NOT EXISTS ''' + create_table_sql + ''' ( name TEXT,mac TEXT PRIMARY KEY,ip TEXT,model TEXT,series TEXT,notes TEXT );''')
            conn.commit()
        except Error as e:
            print("Error Create Table: ", e)
          
    
    # Drop a table
    def drop_table(self, conn, drop_table_sql):
        """ drop a table from the drop_table_sql statement
        :param conn: Connection object
        :param drop_table_sql: a DROP TABLE statement
        :return: 
        """
        try:
            c = self.conn.cursor()
            c.execute(self.drop_table_sql)
            self.conn.commit()
        except Error as e:
            print("Error Drop Table: ", e)
          
        
    # Inserting device info data into table
    def insert_device(self, conn, table_sql, device_name, device_mac, device_ip, device_model, device_series, device_notes):
        """ insert device info data into the table_sql table
        :param conn: connection object
        :param table_sql: target SQL table
        :param device_name: device name to be stored
        :param device_mac: device MAC address
        :param device_ip: current device IP address
        :param device_model: device model
        :param device_series: device series
        :param device_notes: any additional details
        :return:
        """
        try:
            c = conn.cursor()
            c.execute('''INSERT INTO ''' + table_sql + '''(name, mac, ip, model, series, notes)
                         VALUES(?,?,?,?,?,?)''', (device_name, device_mac, device_ip, device_model, device_series, device_notes))
            print("Device entered into SQL")
            conn.commit()
        except Error as e:
            print("Error Insert Device: ", e)
          

    # Retrieve all device info from database and return it as JSON
    def get_all_devices(self, conn, table_sql):    
        """ pull all devices' info from table_sql
        :param conn: connection object
        :param table_sql: target SQL table
        :return: dictionary of all devices in table
        """   
        try:
            c = conn.cursor()
            # Select the database first
            c.execute('''SELECT * FROM %s''', (table_sql))
            # Grab each row and put it in a JSON
            for row in c:
                print('{0} : {1}, {2}'.format(row[0], row[1], row[2]))          
        except Error as e:
            print("Error Get All Devices: ", e)
          
        
    # Check to see if device is already in the table
    def dupe_check(self, conn, table_sql, key):
        """ check the table to see if the key is already entered
        :param conn: connection object
        :param table_sql: target SQL table
        :param key: SQL key/ID to check for, for devices it will be MAC address
        :return: TRUE = Dupe detected, FALSE = no dupe
        """
        #Convert the key over to unicode
        key = unicode(key)
        try:
            c = conn.cursor()
            c.execute("SELECT mac FROM " + table_sql + " WHERE mac = ?", (key,))
            data = c.fetchone()
            if data is None:
                #print('Device has not been entered yet')
                return False
            else:
                #print('Device dupe')
                return True
        except Error as e:
            print("Error Dupe Check: ", e)
          
            
    # Update row of already existing row
    def update_device(self, conn, table_sql, device_name, device_mac, device_ip, device_model, device_series, device_notes):
        """ Update an already entered device in the table        
        :param conn: connection object
        :param table_sql: target SQL table
        :param device_name: device name to be stored
        :param device_mac: device MAC address
        :param device_ip: current device IP address
        :param device_model: device model
        :param device_series: device series
        :param device_notes: any additional details
        :return:"""
        try:
            c = conn.cursor()
            c.execute('''UPDATE ''' + table_sql + ''' SET name = ?, ip = ?, model = ?, series = ?, notes = ? WHERE mac = ?''', (device_name, device_ip, device_model, device_series, device_notes, device_mac))
            conn.commit()
        except Error as e:
            print("Error Update Device: ", e)
                
        
    # Check if device has already been entered into table, if it already is then update the data. If its new, enter a new row
    def update_device_table(self, conn, table_sql, device_name, device_mac, device_ip, device_model, device_series, device_notes):
        """ add/update the table with new info
        :param conn: connection object
        :param table_sql: target SQL table
        :param device_name: device name to be stored
        :param device_mac: device MAC address
        :param device_ip: current device IP address
        :param device_model: device model
        :param device_series: device series
        :param device_notes: any additional details
        :return:
        """
        # Check for dupes first
        dupe = self.dupe_check(conn, table_sql, device_mac)
        if not dupe:
            # Add new device to table
            self.insert_device(conn, table_sql, device_name, device_mac, device_ip, device_model, device_series, device_notes)
        else:
            # Update old entry
            self.update_device(conn, table_sql, device_name, device_mac, device_ip, device_model, device_series, device_notes)
 
    