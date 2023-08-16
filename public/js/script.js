umbralMin = 18
umbralMax = 24

$(document).ready(() => 
{
    function GetRandom() 
    {
        console.log('Runing ajax...');
        $.ajax(
          {
            url: '/testingAjax',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({message: 'Hello from client!'}),
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
   setInterval(GetRandom,1000);
});

document.getElementById("umbral-update").addEventListener("click", actualizarUmbral());


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

function actualizarUmbral(minID,maxID) {
  
}