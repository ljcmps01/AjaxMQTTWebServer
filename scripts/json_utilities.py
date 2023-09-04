import json

def leerJSON(json_path:str, print_flag=False):
    """Lee el contenido de un archivo JSON

    Args:
        json_path (str): ruta del archivo json
        print_flag (bool, optional): si se setea a True, se imprimirá el contenido del archivo. Defaults to False.
        
    Returns:
        str: devuelve el contenido del archivo, en caso de no existir, retorna una str vacia
    """
    
    json_data = ""
    try:
        with open(json_path) as archivo_configuracion:
            json_data = json.loads(archivo_configuracion.read())
    except FileNotFoundError:
        try:
            with open("../"+json_path) as archivo_configuracion:
                json_data = json.loads(archivo_configuracion.read())
        except FileNotFoundError:
            print("No se encontró el archivo")
    
    if print_flag and json_data:
        print(json_data)
    
    return json_data