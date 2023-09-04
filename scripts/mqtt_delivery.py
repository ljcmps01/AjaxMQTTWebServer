import json_utilities

mqtt_server = "bingolab.local"
mqtt_port = 1883
mqtt_topic = "/bingo/temperatura"

config_path = "config.json"

config_JSON = json_utilities.leerJSON(config_path)