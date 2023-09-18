import json
import json_utilities
import hassio_utils as hass

#test only modules
import random

config_path = "Box_config.json"

config_JSON = json_utilities.leerJSON(config_path)

box_topic = "testtopic/box_arduino"

box_listener = hass.BoxListener(box_topic)
    
while True:
    box_listener.client.loop()
    
    
    
