const express=require("express");
const app= express();
const path=require("path");

const bodyParser= require('body-parser');

const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://localhost:1883');


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

app.post('/testingAjax', (req, res) =>{ 
	console.log(req.body);
  //res.send({'response':Math.floor(Math.random()*100)});
  res.send(jsonSalas);
});

