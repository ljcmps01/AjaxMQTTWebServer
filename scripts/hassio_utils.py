import json
import paho.mqtt.client as mqtt

base_discovery_topic = "homeassistant/sensor/placeholder/config"
topic_root = "bingo"

class MQTTPublisher:
    def __init__(self, mqtt_server, mqtt_port):
        self.server = mqtt_server
        self.port = mqtt_port
        self.client = mqtt.Client()
        
        self.client.connect(self.server,self.port,60)
        
        
    def send_message(self, topic:str, payload:str):
        error = False
        if self.client.is_connected():
            self.client.publish(topic,payload)
        else:
            error = True
        return error


class HassioSensor:
    #Generar unico por entidad (temperatura y humedad independientes)
    #Testear las propiedad enabled_by_default  y expire_after 
    #Probar si con el atributo device_class se eligen automaticamente las unidades de medida
    def __init__(self, sensor_id:str, sensor_type:str,sensor_unit:str):
        
        self.id = f"{sensor_type}_{sensor_id}"
        
        self.unit = sensor_unit
        self.type = sensor_type
        
        self.discovery_topic = f'homeassistant/sensor/{self.id}/config'
        self.stat_topic = f'{topic_root}/{sensor_id}/{sensor_type}'
        self.availability_topic = f'{topic_root}/{sensor_id}/available'
        
        self.discovery_payload = self.build_discovery_payload(self.type,self.unit)
        
        
    
    def build_discovery_payload(self,sensor_type:str,unit_of_meas:str):
        sensor_name=f'{sensor_type} {self.id.replace("_"," ")}'
            
        sensor_name=sensor_name.title()
        
        
        discovery_payload = {
            "name":f"{sensor_name}",
            "uniq_id":self.id,
            "stat_t":{self.stat_topic},
            "availability_topic":self.availability_topic,
            "optimistic":False,
            "qos":0,
            "retain":True,
            "unit_of_meas":unit_of_meas,
            "device_class":sensor_type
        }
        
        return discovery_payload
    
    
    
    

    

def gen_header(sala:str,sensor_id:int,beautify=False):
    """genera el nombre del sensor

    Args:
        sala (str): nombre de la sala
        box_id (int): id de la caja
        sensor_id (int): id del sensor
        beautify (bool): Indica si hay que darle formato de nombre o id (capitalizado o no y
        separado por espacio o guion bajo)

    Returns:
        str: nombre generado por la funcion
    """
    name = str()
    separador = "_"
    if beautify:
        sala = sala.capitalize()
        separador = " "
    name = separador.join([sala,str(sensor_id)])
    return name

def get_sensor_info(config_JSON:dict,box_id:int,sensor_index:int, verbose=False):
    """busca la informacion del sensor dada la box id y la ubicacion (puerto) del sensor en
    en json de las cajas

    Args:
        config_JSON (dict): json convertido en dict
        box_id (int): id de la caja
        sensor_index (int): indice del puerto del sensor

    Returns:
        tupla(str,int): devuelve una tupla del nombre de la sala y el id del sensor
    """
    sala = ""
    id = -1
    box_key=f'box{box_id}'
    error_msg = ""
    error_flag = False
    if box_key in config_JSON:
        box_info = config_JSON[box_key]
        if sensor_index < min([len(box_info["ids"]),len(box_info["salas"])]):
            sala = box_info["salas"][sensor_index]
            id = box_info["ids"][sensor_index]
        else:
            error_msg = "ERROR: indice sensor fuera de rango"
            
    else:
        error_msg = f"ERROR, box id ({box_key}) no encontrada"
        
    if verbose and error_flag:
        print(error_msg)
    
    return sala,id
