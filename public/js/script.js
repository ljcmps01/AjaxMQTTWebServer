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
    for(key in sala[i])
    {
      datosSala=datosSala.concat(`${key}:${sala[i][key]}  |`);
    }
    datosSala=datosSala.concat(`<br>`);
  }
  return datosSala;
}