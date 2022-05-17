const express=require("express");
const app= express();
const path=require("path");

const bodyParser= require('body-parser');

const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://127.0.0.1:1883');


//Listas que contendran los objetos de cada sensor de cada sala
let nueva=[];
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
client.on('connect', function () {
  client.subscribe('test', function (err) {
    if (!err) {
      console.log("Conexion MQTT exitosa");
    }
  });
});

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
      if(!isNaN(jsonTempHum.temp))
      {
			  bajo[json.id]=jsonTempHum;
        console.log("Se guardo "+bajo[json.id].temp+"°C "+bajo[json.id].hum+"%");
      }
			
			break;

		case "nueva":
      if(!isNaN(jsonTempHum.temp))
      {
			  nueva[json.id]=jsonTempHum;
        console.log("Se guardo "+nueva[json.id].temp+"°C "+nueva[json.id].hum+"%");
      }
			
			break;

    case "bouchard":
      if(!isNaN(jsonTempHum.temp))
      {
        bouchard[json.id]=jsonTempHum;
        console.log("Se guardo "+bouchard[json.id].temp+"°C "+bouchard[json.id].hum+"%");
      }
      
      break;

    case "cuadri":
      if(!isNaN(jsonTempHum.temp))
      {
        cuadri[json.id]=jsonTempHum;
        console.log("Se guardo "+cuadri[json.id].temp+"°C "+cuadri[json.id].hum+"%");
      }
      
      break;

    case "entrepiso":
      if(!isNaN(jsonTempHum.temp))
      {
        entrepiso[json.id]=jsonTempHum;
        console.log("Se guardo "+entrepiso[json.id].temp+"°C "+entrepiso[json.id].hum+"%");
      }
      
      break;

    case "fuente":
      if(!isNaN(jsonTempHum.temp))
      {
        fuente[json.id]=jsonTempHum;
        console.log("Se guardo "+fuente[json.id].temp+"°C "+fuente[json.id].hum+"%");
      }
      
      break;

    case "principal":
      if(!isNaN(jsonTempHum.temp))
      {
        principal[json.id]=jsonTempHum;
        console.log("Se guardo "+principal[json.id].temp+"°C "+principal[json.id].hum+"%");
      }
      
        break;
                

      case "ruleta":
        if(!isNaN(jsonTempHum.temp))
        {
          ruleta[json.id]=jsonTempHum;
          console.log("Se guardo "+ruleta[json.id].temp+"°C "+ruleta[json.id].hum+"%");
        }
        
        break;

      case "vip":
        if(!isNaN(jsonTempHum.temp))
        {
          vip[json.id]=jsonTempHum;
          console.log("Se guardo "+vip[json.id].temp+"°C "+vip[json.id].hum+"%");
        }
        
        break;
      
		default:
			console.log("no se pudo guardar el json");
			break;
	}
});

let jsonSalas={
  'nueva':nueva,
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

