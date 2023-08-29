umbralMin = null
umbralMax = null

setTimeout(recibirUmbrales, 1000);
$(document).ready(() => 
{

  function leerSensores() 
  {
      // console.log('Runing ajax...');
      $.ajax(
        {
          url: '/enviar-sensores',
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          // data: JSON.stringify({message: 'Hello from client!'}),
          success: (data) => 
          {
            let franciaInfo=cargarDatos(data.francia);
            console.log(franciaInfo);
            document.getElementById("francia").innerHTML=franciaInfo;

            let bajoInfo=cargarDatos(data.bajo);
            console.log(bajoInfo);
            document.getElementById("bajo").innerHTML=bajoInfo;

            let vipInfo=cargarDatos(data.vip);
            console.log(vipInfo);
            document.getElementById("vip").innerHTML=vipInfo;

            let principalInfo=cargarDatos(data.principal);
            console.log(principalInfo);
            document.getElementById("principal").innerHTML=principalInfo;

            let ruletaInfo=cargarDatos(data.ruleta);
            console.log(ruletaInfo);
            document.getElementById("ruleta").innerHTML=ruletaInfo;

            let bouchardInfo=cargarDatos(data.bouchard);
            console.log(bouchardInfo);
            document.getElementById("bouchard").innerHTML=bouchardInfo;

            let fuenteInfo=cargarDatos(data.fuente);
            console.log(fuenteInfo);
            document.getElementById("fuente").innerHTML=fuenteInfo;

            let entrepisoInfo=cargarDatos(data.entrepiso);
            console.log(entrepisoInfo);
            document.getElementById("entrepiso").innerHTML=entrepisoInfo;

            let cuadriInfo=cargarDatos(data.cuadri);
            console.log(cuadriInfo);
            document.getElementById("cuadri").innerHTML=cuadriInfo;

            
          }

      });
    }
   setInterval(leerSensores,1000);
   
   
   const botonUpdateUmbral = $("#umbral-update");
   botonUpdateUmbral.click(()=> actualizarUmbral("umbralMin","umbralMax"));
   
  // document.getElementById("umbralMin").placeholder = `min (${umbralMin}°C)`;
  // document.getElementById("umbralMax").placeholder = `max (${umbralMax}°C)`;
});



//data.sala 
function cargarDatos(sala) 
{
  let datosSala='';
  for(let i=0;i<sala.length;i++)
  {
    alert_type = "alert-secondary";
    datosSala=datosSala.concat('<li class="list-group-item card-group">');
    datosSala=datosSala.concat('<div class="card-group">');
    
    // si se leyó la temperatura
    if (sala[i]!= null && sala[i]['temp'] != 'nan')
    {
      // si la temperatura supera el maximo
      if (sala[i]['temp'] >= umbralMax)
      {
        alert_type = "alert-danger";
      }
      // si la temperatura esta por debajo del minimo
      else if (sala[i]['temp'] <= umbralMin)
      {
        alert_type = "alert-primary";
      }
      // si la temperatura esta dentro del rango establecido
      else
      {
        alert_type = "alert-success";
      }
    }
    for(key in sala[i])
    {
      datosSala=datosSala.concat(`<div class="card alert ${alert_type}">`);
      datosSala=datosSala.concat(`${key}:${sala[i][key]}`);
      datosSala=datosSala.concat('</div>');
    }
    datosSala=datosSala.concat('</div>');
    datosSala=datosSala.concat(`</li>`);
  }
  return datosSala;
}

// Obtengo los vales iniciales de los umbrales
function recibirUmbrales() {
  $.get("/recibir-umbrales",function(data){
    const {min, max} = data;
    umbralMin = min;
    umbralMax = max;
    
    document.getElementById("umbralMin").placeholder = `min (${umbralMin}°C)`;
    document.getElementById("umbralMax").placeholder = `max (${umbralMax}°C)`;
    
  })
}

function actualizarUmbral(minID,maxID) {
  inputUmbralMin = parseFloat(document.getElementById(minID).value);
  inputUmbralMax = parseFloat(document.getElementById(maxID).value);

  if (!isNaN(inputUmbralMin) && inputUmbralMin < umbralMax) {
    umbralMin = inputUmbralMin;
    console.log("Nuevo umbral minimo:", umbralMin);
  } else {
    console.log("Valor de umbral minimo ingresado es invalido");
  } 

  if (!isNaN(inputUmbralMax) && inputUmbralMax > umbralMin) {
    umbralMax = inputUmbralMax;
    console.log("Nuevo umbral maximo:", umbralMax);
  } else {
    console.log("Valor de umbral maximo ingresado es invalido");
  } 

  $.ajax({
    type: "POST",
    url: "actualizar-umbral",
    data: JSON.stringify({ nuevoMinimo: umbralMin, nuevoMaximo: umbralMax}),
    contentType: "application/json",
    success: function(){
      console.log("Se actualizaron los umbrales con exito")
    }
  })

  // Update placeholders with the current values
  document.getElementById(minID).placeholder = `min (${umbralMin}°C)`;
  document.getElementById(maxID).placeholder = `max (${umbralMax}°C)`;

  // Reset the input values
  document.getElementById(minID).value = '';
  document.getElementById(maxID).value = '';
}