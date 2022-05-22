#include <ArduinoJson.h>
#include "DHT.h"

#define nDHT 6
#define DHTTYPE DHT22

#define DHTPIN1 2
#define DHTPIN2 3
#define DHTPIN3 5
#define DHTPIN4 6
#define DHTPIN5 7
#define DHTPIN6 8

//Constructores hardcodeados
/*
DHT dht1(DHTPIN1, DHTTYPE);
DHT dht2(DHTPIN2, DHTTYPE);
DHT dht3(DHTPIN3, DHTTYPE);
DHT dht4(DHTPIN4, DHTTYPE);
DHT dht5(DHTPIN5, DHTTYPE);
DHT dht6(DHTPIN6, DHTTYPE);
*/


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



//Constructores de DHT22 optimizados
DHT dht[nDHT]=
{
  {DHTPIN1,DHTTYPE},
  {DHTPIN2,DHTTYPE},
  {DHTPIN3,DHTTYPE},
  {DHTPIN4,DHTTYPE},
  {DHTPIN5,DHTTYPE},
  {DHTPIN6,DHTTYPE}
};

void setup() {
  // Inicializacion hardcodeada
  /*
  dht1.begin();
  dht2.begin();
  dht3.begin();
  dht4.begin();
  dht5.begin();
  dht6.begin();
  */

  //Inicializacion optimizada
  for (int i=0;i<nDHT;i++)
  {
    dht[i].begin();
  }
}


void loop() {

  for(int i=0;i<nDHT;i++)
  {
    sendDHT2JsonString(dht[i],i);
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
