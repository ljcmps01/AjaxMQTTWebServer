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
              let nuevaInfo='';
      
              for(let i=0;i<data.nueva.length;i++)
              {
                for(key in data.nueva[i])
                {
                  nuevaInfo=nuevaInfo.concat(`${key}:${data.nueva[i][key]}  |`);
                }
                nuevaInfo=nuevaInfo.concat(`<br>`);
              }
              console.log(nuevaInfo);
              document.getElementById("nueva").innerHTML=nuevaInfo;

              let bajoInfo='';
      
              for(let i=0;i<data.bajo.length;i++)
              {
                for(key in data.bajo[i])
                {
                  bajoInfo=bajoInfo.concat(`${key}:${data.bajo[i][key]}  |`);
                }
                bajoInfo=bajoInfo.concat(`<br>`);
              }
              console.log(bajoInfo);
              document.getElementById("bajo").innerHTML=bajoInfo;
            }

        });
    }
   setInterval(GetRandom,1000);
});
