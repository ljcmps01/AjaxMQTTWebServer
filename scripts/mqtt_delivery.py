import json
import json_utilities
import hassio_utils as hass

mqtt_server = "bingolab.local"
mqtt_port = 1883
mqtt_topic = "/bingo/temperatura"

config_path = "Box_config.json"

config_JSON = json_utilities.leerJSON(config_path)

sala,id = hass.get_sensor_info(config_JSON,1,0)
sensor_id=""

if id==-1:
    print("no se pudo obtener los detalles del sensor")
else:
    sensor_id=hass.gen_header(sala,id)
    test = hass.HassioSensor(sensor_id)
    
    print(test.discovery_topic)
    print(json.dumps(test.discovery_payload["humedad"],indent=4))
    print(json.dumps(test.discovery_payload["temperatura"],indent=4))
    
    
