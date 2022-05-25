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

IPAddress server(192, 168, 20, 131);

EthernetClient ethClient;
PubSubClient client(ethClient);

char* outTopic="/bingo/temperatura";

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
  Serial.println(Ethernet.localIP());

  for (int i=0;i<nDHT;i++)
  {
    dht[i].begin();
  }
  
  randomSeed(analogRead(A0));
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }  

    client.loop();
  char data[200];
  
  for(int i=0;i<nDHT;i++)
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
