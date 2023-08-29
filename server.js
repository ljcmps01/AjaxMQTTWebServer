const express=require("express");
const app= express();
const path=require("path");
const fs = require("fs");

const bodyParser= require('body-parser');

const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://localhost:1883');

app.use(bodyParser.json())

const configPath = path.join(__dirname, 'config.json')

let configJSON = null

//Listas que contendran los objetos de cada sensor de cada sala
let francia=[];
let bajo=[];
let bouchard=[];
let cuadri=[];
let entrepiso=[];
let fuente=[];
let principal=[];
let ruleta=[];
let vip=[];

// Umbrales de temperatura
let umbralMin = 10;
let umbralMax = 30;

// Lectura de json inicial

fs.readFile(configPath, 'utf8', (err, data) => {
  if (!err) {
      const initialData = JSON.parse(data);
      configJSON = initialData;
      umbralMin = initialData.umbral.min;
      umbralMax = initialData.umbral.max;
      console.log('Initial umbrals loaded:', umbralMin, umbralMax);
  }
});

console.log(`Min: ${umbralMin}°C\t|Max: ${umbralMax}°C`);

console.log("inicializando...\n");
//Funcion de conexion al servidor MQTT
//Al establecer una conexion exitosa al broker MQTT
//Se suscribe al topic de stream de data de los sensores DHT22
client.on('connect', function () {
  client.subscribe({'/bingo/temperatura':{qos:1}}, function (err) {
    if (!err) {
      console.log("Conexion MQTT exitosa");
    }
    else
    {
      console.log("Conexion MQTT no pudo conectar");
    }
  });
});

//Al recibir un mensaje a traves de un topic suscrito
//topic: variable donde se guarda el nombre del 
//      topic de donde proviene el mensaje
//message: variable donde se guarda la informacion recibida
client.on('message', function (topic, message) 
{
	// message es el mensaje recibido por MQTT

	//imprimo el mensaje recibido
	console.log("se recibio "+message.toString()+"\n");
	json=JSON.parse(message.toString());
	//imprimo la informacion de forma ordenada
	console.log("sala: "+json.sala);
	console.log("id: "+json.id);
	console.log("temperatura: "+json.temp+"°C");
	console.log("humedad: "+json.hum+"%\n");

	let jsonTempHum=
  {
		"id":json.id,
		"temp":json.temp,
		"hum":json.hum
	};

	switch (json.sala) 
  {
		case "bajo":
			  bajo[json.id]=jsonTempHum;
        console.log("Se guardo "+bajo[json.id].temp+"°C "+bajo[json.id].hum+"%");
			
			break;

		case "francia":
			  francia[json.id]=jsonTempHum;
        console.log("Se guardo "+francia[json.id].temp+"°C "+francia[json.id].hum+"%");
			
			break;

    case "bouchard":
        bouchard[json.id]=jsonTempHum;
        console.log("Se guardo "+bouchard[json.id].temp+"°C "+bouchard[json.id].hum+"%");
      
      break;

    case "cuadri":
        cuadri[json.id]=jsonTempHum;
        console.log("Se guardo "+cuadri[json.id].temp+"°C "+cuadri[json.id].hum+"%");
      
      break;

    case "entrepiso":
        entrepiso[json.id]=jsonTempHum;
        console.log("Se guardo "+entrepiso[json.id].temp+"°C "+entrepiso[json.id].hum+"%");
      
      break;

    case "fuente":
        fuente[json.id]=jsonTempHum;
        console.log("Se guardo "+fuente[json.id].temp+"°C "+fuente[json.id].hum+"%");
      
      break;

    case "principal":
      principal[json.id]=jsonTempHum;
      console.log("Se guardo "+principal[json.id].temp+"°C "+principal[json.id].hum+"%");
    
      break;
              

    case "ruleta":
        ruleta[json.id]=jsonTempHum;
        console.log("Se guardo "+ruleta[json.id].temp+"°C "+ruleta[json.id].hum+"%");
      
      break;

    case "vip":
        vip[json.id]=jsonTempHum;
        console.log("Se guardo "+vip[json.id].temp+"°C "+vip[json.id].hum+"%");
      
      break;
    
		default:
			console.log("no se pudo guardar el json");
			break;
	}
});

let jsonSalas={
  'francia':francia,
  'bajo':bajo,
  'bouchard':bouchard,
  'cuadri':cuadri,
  'entrepiso':entrepiso,
  'fuente':fuente,
  'principal':principal,
  'ruleta':ruleta,
  'vip':vip

};

app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname+'/public/html/index.html'));
});
app.listen(3000, () => console.log('Example app is listening on port 3000.'));

app.get('/recibir-umbrales',(req,res)=>{
  res.json({min: umbralMin, max: umbralMax});
});

app.post('/enviar-sensores', (req, res) =>{ 
	// console.log(req.body);
  res.send(jsonSalas);
});

app.post('/actualizar-umbral',(req, res) =>{
  const {nuevoMinimo,nuevoMaximo} = req.body;
  
  editarConfigJSON(configPath, "umbral", "min",nuevoMinimo);
  editarConfigJSON(configPath, "umbral", "max",nuevoMaximo);
  
  umbralMin = nuevoMinimo;
  umbralMax = nuevoMaximo;
  
  console.log ('Nuevos umbrales: ', umbralMin, '°C |',umbralMax,'°C');
  res.sendStatus(200);
});

function editarConfigJSON(path,keyPrimaria,keySecundaria,valor) {
  nuevaConfig = configJSON;
  if (keyPrimaria in nuevaConfig){
    if (keySecundaria in nuevaConfig[keyPrimaria]){
      nuevaConfig[keyPrimaria][keySecundaria]= valor
      fs.writeFile(path, JSON.stringify(nuevaConfig, null,2), (err) => {
        if (!err) {
            console.log("archivo escrito exitosamente");
            console.log(nuevaConfig);
        }
      })
    }
  }
}
