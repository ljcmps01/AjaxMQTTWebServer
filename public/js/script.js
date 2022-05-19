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
              let nuevaInfo=cargarDatos(data.nueva);
              console.log(nuevaInfo);
              document.getElementById("nueva").innerHTML=nuevaInfo;

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


//data.sala 
function cargarDatos(sala) 
{
  let datosSala='';
  for(let i=0;i<sala.length;i++)
  {
    datosSala=datosSala.concat('<li class="list-group-item">');
    for(key in sala[i])
    {
      datosSala=datosSala.concat(`${key}:${sala[i][key]}  |`);
    }
    datosSala=datosSala.concat(`</li>`);
  }
  return datosSala;
}