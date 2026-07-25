const formulario = document.getElementById("animeForm");

const lista = document.getElementById("listaRecomendaciones");

const mensaje = document.getElementById("mensaje");



let recomendaciones = JSON.parse(
    localStorage.getItem("recomendaciones")
) || [];



limpiarRecomendaciones();

mostrarRecomendaciones();



formulario.addEventListener("submit", function(e){

    e.preventDefault();


    let anime = {

        nombre:
        document.getElementById("nombre").value,

        genero:
        document.getElementById("genero").value,

        anio:
        document.getElementById("anio").value,

        descripcion:
        document.getElementById("descripcion").value,

        usuario:
        document.getElementById("usuario").value || "Anonimo",


        fecha:
        Date.now()

    };



    recomendaciones.push(anime);



    localStorage.setItem(
        "recomendaciones",
        JSON.stringify(recomendaciones)
    );



    mensaje.textContent =
    "Recomendacion enviada";



    setTimeout(()=>{

        mensaje.textContent="";

    },5000);



    formulario.reset();



    mostrarRecomendaciones();


});






function limpiarRecomendaciones(){


    let ahora = Date.now();



    recomendaciones = recomendaciones.filter(anime=>{


        if(!anime.fecha){

            anime.fecha = ahora;

        }



        let dias =

        (ahora - anime.fecha)

        /

        (1000 * 60 * 60 * 24);



        return dias < 14;


    });



    localStorage.setItem(

        "recomendaciones",

        JSON.stringify(recomendaciones)

    );


}







function tiempoPublicado(fecha){


    let dias = Math.floor(

        (Date.now() - fecha)

        /

        (1000 * 60 * 60 * 24)

    );



    if(dias <= 0){

        return "Se recomendo hoy";

    }



    return "Se recomendo hace " + dias + "d";


}







function tiempoBorrado(fecha){


    let diasPasados = Math.floor(

        (Date.now() - fecha)

        /

        (1000 * 60 * 60 * 24)

    );



    let restantes = 14 - diasPasados;



    if(restantes <= 0){

        return "";

    }



    if(restantes === 1){

        return "Se borrara en: 1 dia";

    }



    return "Se borrara en: " + restantes + " dias";


}







function mostrarRecomendaciones(){


    limpiarRecomendaciones();



    lista.innerHTML="";



    recomendaciones.forEach(anime=>{


        let div = document.createElement("div");



        div.className="recomendacion";



        div.innerHTML = `


        <h3>${anime.nombre}</h3>



        <p>

        <b>Genero:</b> ${anime.genero || "No especificado"}

        </p>



        <p>

        <b>Año:</b> ${anime.anio || "Desconocido"}
        
        </p>



        <p>

        ${anime.descripcion}

        </p>



        <span>

        Recomendado por: ${anime.usuario}

        </span>




        <div class="recommend-time">


            <p>

            ${tiempoPublicado(anime.fecha)}

            </p>



            <p>

            ${tiempoBorrado(anime.fecha)}

            </p>


        </div>



        `;



        lista.appendChild(div);



    });


}