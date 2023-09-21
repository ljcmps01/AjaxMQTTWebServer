import json_utilities
import hassio_utils as hass
from systemd import journal

from time import sleep

#test only modules
# import random

config_path = "/home/laboratorio_sv/scripts/hassio-listener/Box_config.json"

journal.send("Abriendo archivo de configuracion")
config_JSON = json_utilities.leerJSON(config_path)

if(config_JSON != ""):
    journal.send("configuracion cargada exitosamente")
else:
    journal.send("No se pudo leer el archivo")
    exit()

box_topic = "testtopic/box_arduino"

box_listener = hass.BoxListener(box_topic, config_JSON)
    
while True:
    box_listener.client.loop()
    
    box_listener.sensor_loop()
    sleep(.5)
    
    
