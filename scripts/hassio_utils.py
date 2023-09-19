import json
import paho.mqtt.client as mqtt

mqtt_server = "bingolab.local"
mqtt_port = 1883

#dev
# topic_root = "testtopic/test"
# discovery_root = "testtopic/test"

#prod
topic_root = "bingo"
discovery_root = "homeassistant"

class HassioSensor:
    #Generar unico por entidad (temperatura y humedad independientes)
    #Testear las propiedad enabled_by_default  y expire_after 
    #Probar si con el atributo device_class se eligen automaticamente las unidades de medida
    def __init__(self, sensor_id:str, sensor_type:str,sensor_unit:str, arduino_topic:str):
        
        self.id = f"{sensor_type}_{sensor_id}"
        
        self.unit = sensor_unit
        self.type = sensor_type
        
        self.discovery_topic = f'{discovery_root}/sensor/{self.id}/config'
        self.stat_topic = f'{topic_root}/{sensor_id}/{sensor_type}'
        self.availability_topic = f'{topic_root}/{sensor_id}/available'
        
        self.discovery_payload = self.build_discovery_payload(self.type,self.unit)
        
        self.client = mqtt.Client()
        
        self.client.connect(mqtt_server,mqtt_port)
        self.client.on_connect = self.connect_callback
        
    def connect_callback(self,client ,userdata, mid, granted_qos):
        print(f"sensor {self.id} conectado exitosamente")
        self.client.publish(self.discovery_topic,self.discovery_payload)
        self.client.publish(self.availability_topic,"online")
        
        
    
    def build_discovery_payload(self,sensor_type:str,unit_of_meas:str):
        sensor_name=f'{sensor_type} {self.id.replace("_"," ")}'
            
        sensor_name=sensor_name.title()
        
        
        discovery_payload = {
            "name":f"{sensor_name}",
            "uniq_id":self.id,
            "stat_t":self.stat_topic,
            "availability_topic":self.availability_topic,
            "optimistic":False,
            "qos":0,
            "retain":True,
            "unit_of_meas":unit_of_meas,
            "device_class":sensor_type
        }
        parsed_discovery_payload = json.dumps(discovery_payload)
        return parsed_discovery_payload
    
    def send_status(self,value, tries = 3):
        error = False
        err_count=0
        
        while err_count < tries:
            if self.client.is_connected():
                self.client.publish(self.stat_topic,value)
                error = False
                break
            else:
                print(f"sensor {self.id} no conectado")
                self.client.connect(mqtt_server,mqtt_port)
                error = True
                err_count+=1            
        
        return error
    
class BoxListener:
    def __init__(self,box_topic:str, config_dict:dict):
        self.client = mqtt.Client()
        self.in_topic = box_topic
        self.sensor_dict = dict()
        self.boxes_config = config_dict
        
        self.client.connect(mqtt_server,mqtt_port)
        self.client.subscribe(self.in_topic)
        
        self.client.on_message = self.message_arrive
        
    def message_arrive(self, client, userdata, message:mqtt.MQTTMessage):
        error = False
        payload = json.loads(message.payload)
        
        print(f'se recibio:\n{payload}')
        
        sala,id = get_sensor_info(self.boxes_config,payload["box_id"],payload["sensor_id"])
        
        if id != -1:
            sensor_id = gen_header(sala,id)
            
            if not(sensor_id in self.sensor_dict):
                new_temp_sensor = HassioSensor(sensor_id,"temperature","°C",self.in_topic)
                new_hum_sensor = HassioSensor(sensor_id,"humidity","%",self.in_topic)
                
                self.sensor_dict.update({
                    sensor_id : {"temperature":new_temp_sensor,
                                "humidity":new_hum_sensor}
                })
                
            self.sensor_dict[sensor_id]["temperature"].send_status(payload["temp"])
            self.sensor_dict[sensor_id]["humidity"].send_status(payload["hum"])
            
        else:
            error = True
        return error
    
    def sensor_loop(self):
        for sensor in self.sensor_dict:
            for sensor_type in self.sensor_dict[sensor]:
                self.sensor_dict[sensor][sensor_type].client.loop()
            
        
        
        
    
    

    

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
    else:
        sala = sala.replace(" ","_")
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
