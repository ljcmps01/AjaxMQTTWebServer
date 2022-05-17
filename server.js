const express=require("express");
const app= express();
const path=require("path");

const bodyParser= require('body-parser');


let Nueva=[
  {
    'id':0,
    'temp':25.4,
    'hum':50.7
  },
  {
    'id':1,
    'temp':26.0,
    'hum':55.0
  }
];

let Bajo=[
  {
    'id':0,
    'temp':30.0,
    'hum':55.0
  },
  {
    'id':1,
    'temp':28.3,
    'hum':56
  }
];

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

