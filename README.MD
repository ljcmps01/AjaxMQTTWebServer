# Monitoreo de Temperatura
Sistema de monitoreo de temperatura de sala a traves de pagina web

## Hardware
* Arduino UNO(ATMEGA328P)
* Shield Ethernet para Arduino UNO
* DHT22

### TO-DO
#### 1. Script generador de archivo config_sensores.h
    Este tiene como objetivo facilitar al usuario la configuracion de las cajas de derivacion, el script debe preguntar al usuario cuantos sensores se conectaran a la caja (1 a 6), y le ira preguntando a que sala pertenece cada sensor y el ID del mismo (pensar si es posible generar el ID automaticamente)

### 2. Mejorar script anterior para realizar la carga de firmware automaticamente 

La parte del hardware se basa en un arduino UNO el cual lee la informacion de hasta 6 sensores DHT22 conectados y los manda a un servidor web.

El codigo principal es el encontrado en Arduino>DHTwJSON, el cual toma la configuracion escrita en el archivo config_sensores.h.

## Software
* Node.js (servidor web)
* MQTT (transmision de datos)
* Python (loggeo, analisis de datos)

### TO-DO
#### 1. Configuracion de umbral persistente
    Actualmente la configuracion es durante la sesion y de forma local, es decir,
    desde la pagina web uno puede configurar el rango tolerable y funcionara correctamente,
    sin embargo, esta configuracion durará hasta que se salga de la pagina y no está sincronizada de ninguna forma con el servidor de Node JS, si por ejemplo, se recarga la pagina, los valores establecidos desapareceran y volveran a los configurados en el script

    La idea es que el servidor lea un JSON de configuracion dentro del propio directorio dentro del cual estara la informacion del umbral con su minimo y maximo, entonces al iniciar el servidor este leerá dicho archivo y posteriormente lo mandará a la pagina web una vez se hayá cargador la pagina.

    Luego, dentro de la pagina web el usuario podrá modificar los valores de la misma forma que se hace actualmente, con la diferencia de que una vez que son modificados, dichos valores serán enviados al servidor para que este modifique el JSON de configuración

#### 2. Notificación via mail
    (Depende de #1)
    La idea es que este programa sea independiente del servidor web, este leerá los parametros dentro del JSON de configuracion (pensar como hacer para que se actualice en vivo, es decir, si se modifican los parametros luego de haber iniciado el script, este debera detectar el cambio y actualizar los valores) y se pondra a monitorear los valores de temperatura registrados, si se lee algun valor valido (no nan) pero que esté fuera del umbral permitido, este script se encargará de enviarle un mail a las personas permitentes (crear objeto "emails" en json de configuracion?)

#### 3. Loggeo en txt y excel (registro historico)
    Recibe todos los mensajes dentro del topic de temperatura y los guarda en un archivo txt y xlsx (pensar si es mejor hacer programas aparte o si es mejor que esten separados)

    leer el JSON de configuracion para setear maximos guardados? ej, guardar hasta N dias de antiguedad, hasta N Mb de tamaño de archivo, etc.

#### 4. Descarga de archivos de loggeo

#### 5. Configuracion de json via Web

#### 6. Analisis de datos
    (Depende de #3)
    Con los datos obtenidos en el Excel, hacer graficos varios para visualizar los datos obtenidos


### Config JSON
Es un archivo donde estan todos los parametros sobre los cual se van a configurar las diversas funcionalides del sistema (umbral, lista de emails, cantidad de dias guardados)

Tendra un formato similar a:

```
{
    "umbral":{
        "min":float,
        "max":float;
    },
    "emails:[
        "email0@gmail.com",
        "email1@gmail.com",
        "email2@gmail.com"
    ]
}
```

### MQTT datastream
El arduino se encargará de recolectar los datos de los sensores y los junta con su respectiva sala e ID en un objeto JSON con el siguiente formato
```
{
    "sala": string,
    "id": int,
    "temp": float,
    "hum": float
}
```
Este paquete sera enviado individualmente a medida que se vaya leyendo cada sensor.

El mismo se enviara a traves del topic **/bingo/temperatura** a traves del servidor MQTT

## Setup
A nivel fisico, por un lado está la caja de derivacion la cual tiene en el lado izquierdo los puertos del arduino, donde iran conectados la alimentacion del mismo y un jack RJ45 el cual debera ir conectado a la red del servidor.
Del lado derecho se encuentran 6 puertos RJ45 en los cuales se conectaran los sensores DHT22

La ubicacion y ID de cada sensor será grabado en el Arduino de la caja de derivacion donde está conectado cada sensor segun el puerto conectado. Dicha información estará asignada en el archivo header "config_sensores.h".

**Actualmente, se debe modificar el archivo header manualmente, pero proximamente habra un script que automatice está configuracion para evitar errores de tipeo.**

Una vez configurado la informacion de cada puerto, se debe compilar y cargar el sketch "DHTwJSON.ino" al arduino de la caja de derivación y ya quedará listo para colocar en la sala.

**Nuevamente, actualmente se debe abrir el sketch, compilarlo y cargarlo al arduino utilizando el Arduino IDE, pero proximamente habran scripts que automaticen este proceso a traves de una ventana de comandos para que la carga sea mucho mas rapida y sencilla para el usuario**

El resto de la configuracion es casi automatica, solo se debe realizar la instalacion y el cableado necesario para distribuir las cajas y sensores a traves de la sala utilizando switches entre las cajas de derivacion de ser necesario.

El funcionamiento de los servicios (web, mail, log, etc) deberia ser practicamente automatico, aunque puede llegar a ser necesario una modificar la configuracion establecida en el config.json

**Actualmente, se debe modificar el json manualmente, pero la idea es que se puede modificar desde la pagina web**



