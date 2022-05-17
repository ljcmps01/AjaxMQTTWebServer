const express=require("express");
const app= express();
const path=require("path");

const bodyParser= require('body-parser');

const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://127.0.0.1:1883');

let Nueva=[];

let Bajo=[];

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
			  Bajo[json.id]=jsonTempHum;
        console.log("Se guardo "+Bajo[json.id].temp+"°C "+Bajo[json.id].hum+"%");
      }
			
			break;

		case "nueva":
      if(!isNaN(jsonTempHum.temp))
      {
			  Nueva[json.id]=jsonTempHum;
        console.log("Se guardo "+Nueva[json.id].temp+"°C "+Nueva[json.id].hum+"%");
      }
			
			break;

		default:
			console.log("no se pudo guardar el json");
			break;
	}
});

let jsonSalas={
  'nueva':Nueva,
  'bajo':Bajo
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

