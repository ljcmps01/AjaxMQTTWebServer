import json
import json_utilities
import hassio_utils as hass

#test only modules
import random

config_path = "Box_config.json"

config_JSON = json_utilities.leerJSON(config_path)

sala,id = hass.get_sensor_info(config_JSON,1,0)
sensor_id=""

box_topic = "testtopic/box_arduino"

def callback(sensor:hass.HassioSensor):
    sensor.client.publish(sensor.stat_topic,random.random()*10)
    print("se recibio el mensaje")

def connect_callback(sensor:hass.HassioSensor):
    print("conectado exitosamente")
    sensor.client.publish(sensor.discovery_topic,sensor.discovery_payload)
    sensor.client.publish(sensor.availability_topic,"online")
    

if id==-1:
    print("no se pudo obtener los detalles del sensor")
else:
    sensor_id=hass.gen_header(sala,id)
    test = hass.HassioSensor(sensor_id,"temperature","°C",box_topic)
    
    print(test.discovery_topic)
    
    test.client.on_subscribe = connect_callback
    test.client.subscribe(box_topic)
    
    while True:
        test.client.on_message=callback
    
    
    
    
