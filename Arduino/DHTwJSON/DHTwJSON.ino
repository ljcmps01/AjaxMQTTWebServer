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
IPAddress ip(192, 168, 20, 201);
IPAddress server(192, 168, 20, 131);

EthernetClient ethClient;
PubSubClient client(ethClient);

char* outTopic="test";

// Inicializo los sensores DHT.
DHT dht1(DHTPIN1, DHTTYPE);
DHT dht2(DHTPIN2, DHTTYPE);
DHT dht3(DHTPIN3, DHTTYPE);
DHT dht4(DHTPIN4, DHTTYPE);
DHT dht5(DHTPIN5, DHTTYPE);
DHT dht6(DHTPIN6, DHTTYPE);



//Funcion de conexion al servidor MQTT
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("arduinoClient")) {
      Serial.println("connected");
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

  Ethernet.begin(mac, ip);


  dht1.begin();
  dht2.begin();
  dht3.begin();
  dht4.begin();
  dht5.begin();
  dht6.begin();
}

void loop() {
  DynamicJsonDocument lectura(256);
  float temp;
  float hum;

  char bufferMQTT[256];

  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  delay(INTERVALO);
  //Comienzo la lectura del DHT
  Serial.println("DHT1");
  lectura["sala"]=salas[0];
  lectura["id"]=id[0];
  temp=dht1.readTemperature();
  hum=dht1.readHumidity();
  if(isnan(temp)||isnan(hum)){
    Serial.println("error en lectura");
    
    lectura["temp"]="nan";
    lectura["hum"]="nan";
    serializeJson(lectura,bufferMQTT);
    client.publish(outTopic,bufferMQTT);
  }
  else{
    lectura["temp"]=temp;
    lectura["hum"]=hum;
    serializeJson(lectura["temp"],Serial);
    Serial.println("°C");
    serializeJson(lectura["hum"],Serial);
    Serial.println("%");
    serializeJson(lectura,bufferMQTT);
    Serial.println("");
    serializeJson(lectura,Serial);
    Serial.println("");
    
    client.publish(outTopic,bufferMQTT);
  }
  //Enviar lectura por MQTT 
  delay(INTERVALO);
  //Comienzo la lectura del DHT
  Serial.println("DHT2");
  lectura["sala"]=salas[1];
  lectura["id"]=id[1];
  temp=dht2.readTemperature();
  hum=dht2.readHumidity();
  if(isnan(temp)||isnan(hum)){
    Serial.println("error en lectura");
    
    lectura["temp"]="nan";
    lectura["hum"]="nan";
    serializeJson(lectura,bufferMQTT);
    client.publish(outTopic,bufferMQTT);
  }
  else{
    lectura["temp"]=temp;
    lectura["hum"]=hum;
    serializeJson(lectura["temp"],Serial);
    Serial.println("°C");
    serializeJson(lectura["hum"],Serial);
    Serial.println("%");
    serializeJson(lectura,bufferMQTT);
    Serial.println("");
    serializeJson(lectura,Serial);
    Serial.println("");

    client.publish(outTopic,bufferMQTT);
  }
  //Enviar lectura por MQTT 
  delay(INTERVALO);
  //Comienzo la lectura del DHT
  Serial.println("DHT3");
  lectura["sala"]=salas[2];
  lectura["id"]=id[2];
  temp=dht3.readTemperature();
  hum=dht3.readHumidity();
  if(isnan(temp)||isnan(hum)){
    Serial.println("error en lectura");
    
    lectura["temp"]="nan";
    lectura["hum"]="nan";
    serializeJson(lectura,bufferMQTT);
    client.publish(outTopic,bufferMQTT);
  }
  else{
    lectura["temp"]=temp;
    lectura["hum"]=hum;
    serializeJson(lectura["temp"],Serial);
    Serial.println("°C");
    serializeJson(lectura["hum"],Serial);
    Serial.println("%");
    serializeJson(lectura,bufferMQTT);
    Serial.println("");
    serializeJson(lectura,Serial);
    Serial.println("");

    client.publish(outTopic,bufferMQTT);
  }
  //Enviar lectura por MQTT 
  delay(INTERVALO);
  //Comienzo la lectura del DHT
  Serial.println("DHT4");
  lectura["sala"]=salas[3];
  lectura["id"]=id[3];
  temp=dht4.readTemperature();
  hum=dht4.readHumidity();
  if(isnan(temp)||isnan(hum)){
    Serial.println("error en lectura");
    
    lectura["temp"]="nan";
    lectura["hum"]="nan";
    serializeJson(lectura,bufferMQTT);
    client.publish(outTopic,bufferMQTT);
  }
  else{
    lectura["temp"]=temp;
    lectura["hum"]=hum;
    serializeJson(lectura["temp"],Serial);
    Serial.println("°C");
    serializeJson(lectura["hum"],Serial);
    Serial.println("%");
    serializeJson(lectura,bufferMQTT);
    Serial.println("");
    serializeJson(lectura,Serial);
    Serial.println("");

    client.publish(outTopic,bufferMQTT);
  }
  //Enviar lectura por MQTT 
  delay(INTERVALO);
  //Comienzo la lectura del DHT
  Serial.println("DHT5");
  lectura["sala"]=salas[4];
  lectura["id"]=id[4];
  temp=dht5.readTemperature();
  hum=dht5.readHumidity();
  if(isnan(temp)||isnan(hum)){
    Serial.println("error en lectura");
    
    lectura["temp"]="nan";
    lectura["hum"]="nan";
    serializeJson(lectura,bufferMQTT);
    client.publish(outTopic,bufferMQTT);
  }
  else{
    lectura["temp"]=temp;
    lectura["hum"]=hum;
    serializeJson(lectura["temp"],Serial);
    Serial.println("°C");
    serializeJson(lectura["hum"],Serial);
    Serial.println("%");
    serializeJson(lectura,bufferMQTT);
    Serial.println("");
    serializeJson(lectura,Serial);
    Serial.println("");

    client.publish(outTopic,bufferMQTT);
  }
  //Enviar lectura por MQTT 
  delay(INTERVALO);
  //Comienzo la lectura del DHT
  Serial.println("DHT6");
  lectura["sala"]=salas[5];
  lectura["id"]=id[5];
  temp=dht6.readTemperature();
  hum=dht6.readHumidity();
  if(isnan(temp)||isnan(hum)){
    Serial.println("error en lectura");
    
    lectura["temp"]="nan";
    lectura["hum"]="nan";
    serializeJson(lectura,bufferMQTT);
    client.publish(outTopic,bufferMQTT);
  }
  else{
    lectura["temp"]=temp;
    lectura["hum"]=hum;
    serializeJson(lectura["temp"],Serial);
    Serial.println("°C");
    serializeJson(lectura["hum"],Serial);
    Serial.println("%");
    serializeJson(lectura,bufferMQTT);
    Serial.println("");
    serializeJson(lectura,Serial);
    Serial.println("");

    client.publish(outTopic,bufferMQTT);
  }
  //Enviar lectura por MQTT 
  delay(INTERVALO);
}
