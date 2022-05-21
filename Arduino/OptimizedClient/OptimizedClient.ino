#include "DHT.h"

#define nDHT 2
#define DHTTYPE DHT22

//Constructores hardcodeados
/*
DHT dht1(DHTPIN1, DHTTYPE);
DHT dht2(DHTPIN2, DHTTYPE);
DHT dht3(DHTPIN3, DHTTYPE);
DHT dht4(DHTPIN4, DHTTYPE);
DHT dht5(DHTPIN5, DHTTYPE);
DHT dht6(DHTPIN6, DHTTYPE);
*/


//Constructores de DHT22 optimizados
DHT dht[nDHT]=
{
  {DHTPIN,DHTTYPE},
  {DHTPIN,DHTTYPE},
  {DHTPIN,DHTTYPE},
  {DHTPIN,DHTTYPE},
  {DHTPIN,DHTTYPE},
  {DHTPIN,DHTTYPE}
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

  

}

void sendDHT2MQTT(DHT){
  float
}
