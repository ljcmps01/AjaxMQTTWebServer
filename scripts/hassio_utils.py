import json

base_discovery_topic = "homeassistant/sensor/placeholder/config"

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

def build_discovery_topic(sensor_id:str,base_topic=base_discovery_topic,topic_placeholder="placeholder"):
    """Crea el topic de discovery del sensor segun su id reemplazando el placeholder 
    por el sensor_id en la base del topic cargado

    Args:
        sensor_id (str): nombre id del sensor
        base_topic (str, optional): Plantilla base del topic a generar. Por defecto se carga la plantilla generica
        de Homeassistant para MQTT Discovery.
        topic_placeholder (str, optional): string a buscar dentro de base topic para reemplazar por el 
        id del sensor. Defaults to "placeholder".

    Returns:
        str: topic generado, si no se pudo realizar al menos un reemplazo devuelve una string vaia
    """
    discovery_topic = ""
    
    if topic_placeholder in base_topic:
        discovery_topic = base_topic.replace(topic_placeholder,sensor_id)
        
    return discovery_topic

def build_discovery_payload(sensor_id:str,topic_root:str,sensor_type:str,unit_of_meas:str,sensor_name="",prefix_type=True):
    if not sensor_name:
        sensor_name=sensor_id.replace("_"," ")
        sensor_name=sensor_name.capitalize()
    
    if prefix_type:
        sensor_name=f'{sensor_type} {sensor_name}'
    
    base_discovery_payload = {
        "name":f"{sensor_name}",
        "uniq_id":f"{sensor_id}",
        "stat_t":f"{topic_root}/{sensor_id}/{sensor_type}",
        "availability_topic":f"{topic_root}/{sensor_id}/available",
        "optimistic":False,
        "qos":0,
        "retain":True,
        "unit_of_meas":f"{unit_of_meas}"
    }
    
    return base_discovery_payload
    
    
