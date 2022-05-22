/*Envio los datos sensados por el DHT por MQTT en formato JSON
 * 
 * Falta probar la conexion MQTT
 */

#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

#include "DHT.h"
#include <ArduinoJson.h>

#define INTERVALO 1000

#define nDHT 6
#define DHTPIN1 2
#define DHTPIN2 3
#define DHTPIN3 5
#define DHTPIN4 6
#define DHTPIN5 7
#define DHTPIN6 8

#define DHTTYPE DHT22   


//Opciones: 
//"bajo","bouchard","cuadri","entrepiso","fuente",
//"principal","ruleta","vip"
const char* salas[6]={
  "bajo",
  "bajo",
  "bajo",
  "nueva",
  "nueva",
  "vip"
};

const int id[6]={0,1,2,0,1,0};

byte mac[]    = {  0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xED };
//IPAddress ip(192, 168, 20, 201);
IPAddress server(192, 168, 20, 131);

EthernetClient ethClient;
PubSubClient client(ethClient);

char* outTopic="test";

// Inicializo los sensores DHT.
DHT dht[nDHT]=
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
  Serial.println(F("DHTxx test!"));

  

  client.setServer(server, 1883);

  Ethernet.begin(mac);


  for (int i=0;i<nDHT;i++)
  {
    dht[i].begin();
  }
  
  randomSeed(analogRead(A0));
}

void loop() {
  StaticJsonDocument<100> lectura;
  float temp;
  float hum;

  char bufferMQTT[100];

  if (!client.connected()) {
    reconnect();
  }

  
  
  for(int i=0;i<nDHT;i++)
  {
    client.publish(outTopic,sendDHT2JsonString(dht[i],i));
    delay(INTERVALO);
    client.loop();
  }
}



char sendDHT2JsonString(DHT sensor,int indice)
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
    lectura["temp"]="error";
    lectura["hum"]="error";
  }
  else
  {
    lectura["temp"]=temp;
    lectura["hum"]=hum;    
  }
  serializeJson(lectura,data);
  return data;
}
