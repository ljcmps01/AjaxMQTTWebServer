import json
import os

import json_utilities
import email_utilities as email

mqtt_server = "bingolab.local"
mqtt_port = 1883
mqtt_topic = "/bingo/temperatura"

config_path = "config.json"

config_JSON = json_utilities.leerJSON(config_path)
    
lista_mails = config_JSON['emails']

print("Mails cargados:")

if email.listar_mails(lista_mails)>0:
    print("Se encontraron mails invalidos en el archivo de configuracion")

