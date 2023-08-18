/*Envio los datos sensados por el DHT por MQTT en formato JSON
 * 
 * Falta probar la conexion MQTT
 */

#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

#include "DHT.h"
#include <ArduinoJson.h>

#include "config_sensores.h"

#define INTERVALO 1000


#define DHTPIN1 A0
#define DHTPIN2 A1
#define DHTPIN3 A2
#define DHTPIN4 A3
#define DHTPIN5 A4
#define DHTPIN6 A5

#define DHTTYPE DHT22   


//Opciones: 
//"bajo","bouchard","cuadri","entrepiso","fuente",
//"principal","ruleta","vip"
const char* salas[6]={
  SALA_SENSOR0,
  SALA_SENSOR1,
  SALA_SENSOR2,
  SALA_SENSOR3,
  SALA_SENSOR4,
  SALA_SENSOR5
};

const int id[6]={
  ID_SENSOR0,
  ID_SENSOR1,
  ID_SENSOR2,
  ID_SENSOR3,
  ID_SENSOR4,
  ID_SENSOR5
};

// const char* server = "bingolab.local";
IPAddress server(192, 168, 20, 136);

EthernetClient ethClient;
PubSubClient client(ethClient);

const char* outTopic="/bingo/temperatura";

// Inicializo los sensores DHT.
DHT dht[N_DHT]=
{
  {DHTPIN1,DHTTYPE},
  {DHTPIN2,DHTTYPE},
  {DHTPIN3,DHTTYPE},
  {DHTPIN4,DHTTYPE},
  {DHTPIN5,DHTTYPE},
  {DHTPIN6,DHTTYPE}
};


//Funcion de conexion al servidor MQTT
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    char clientId[16]="arduinoClient";
    int rNum=random(0,999);
    char cRandom[10];
    itoa(rNum,cRandom,6);
    strcat(clientId,cRandom);
    if (client.connect(clientId)) {
      Serial.println("connected");
      Serial.println(clientId);
      // Once connected, publish an announcement...
      //client.publish("outTopic","hello world");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(9600);
  Serial.println(F("DHT22:"));
  
  Serial.println("#DHT\t|\t   sala   \t|\tID");
  Serial.println("------------------------------------------------------------");
  for (int i=0;i<N_DHT;i++)
  {
    dht[i].begin();
    Serial.print(i+1);
    Serial.print("\t|\tsala: ");
    Serial.print(salas[i]);
    Serial.print("\t|\tid:");
    Serial.println(id[i]);
  } 

  randomSeed(analogRead(A0));

  client.setServer(server, 1883);

  byte mac[]= {  0xDE, 0xED, 0xBA, 0xFE, 0xFE, byte(random(0,256)) };
  Ethernet.begin(mac);
  Serial.println(Ethernet.localIP());
  
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }  

    client.loop();
  char data[200];
  
  for(int i=0;i<N_DHT;i++)
  {
    sendDHT2JsonString(dht[i],i,data);
    Serial.println(data);
    client.publish(outTopic,data);
    delay(INTERVALO);
    client.loop();
  }
}



void sendDHT2JsonString(DHT sensor,int indice, char *salida)
{
  StaticJsonDocument<100> lectura;
  char data[100];
  
  float temp;
  float hum;

  lectura["sala"]=salas[indice];
  lectura["id"]=id[indice];

  temp=sensor.readTemperature();
  hum=sensor.readHumidity();
  if(isnan(temp)||isnan(hum))
  {
    lectura["temp"]="nan";
    lectura["hum"]="nan";
  }
  else
  {
    lectura["temp"]=temp;
    lectura["hum"]=hum;    
  }
  serializeJson(lectura,data);
  strcpy(salida,data);
}
