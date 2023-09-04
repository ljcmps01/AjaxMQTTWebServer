import re

def validar_mail(mail:str):
    """Verifica que el str ingresado sea una direccion de correo valida

    Args:
        mail (str): direccion de mail a analizar

    Returns:
        bool: retorna True si es una direccion valida
    """
    validacion = False
    
    if re.search(".+@{1}.+\.com$",mail):
        validacion = True
    
    return validacion

def listar_mails(lista_mails:list,print_all=False):
    """imprime todas las direcciones de mail cargadas en una lista,
    por defecto filtra las direcciones invalidas pero el parametro
    print_all permite imprimir todo el contenido ingresado remarcando
    cuales son las direcciones invalidas

    Args:
        lista_mails (list): lista a analizar
        print_all (bool, optional): si se setea a True, imprimira todo 
        el contenido remarcando cuales son direcciones invalidas. Defaults to False.

    Returns:
        int: retorna la cantidad de errores encontrados
    """
    lista_validos, lista_invalidos = filtrar_mails(lista_mails)
    for mail in lista_validos:
        print(mail)
    if print_all:
        for mail in lista_invalidos:
            print(f"[NO VALIDO] {mail}")
            
    return len(lista_invalidos)

def filtrar_mails(lista_mails:list):
    """Separa los mails validos de los invalidos en una lista

    Args:
        lista_mails (list): lista completa de mails

    Returns:
        tuple,list: retorna dos listas, una con los mails validos y otra con los invalidos
    """
    lista_validos = list()
    lista_errores = list()
    for mail in lista_mails:
        if validar_mail(mail):
            if not(mail in lista_validos):
                lista_validos.append(mail)
        else:
            if not(mail in lista_errores):
                lista_errores.append(mail)
    
    return lista_validos,lista_errores