import json_utilities
import hassio_utils as hass

from time import sleep

#test only modules
import random

config_path = "Box_config.json"

config_JSON = json_utilities.leerJSON(config_path)

box_topic = "testtopic/box_arduino"

box_listener = hass.BoxListener(box_topic, config_JSON)
    
while True:
    box_listener.client.loop()
    
    box_listener.sensor_loop()
    sleep(.5)
    
    
