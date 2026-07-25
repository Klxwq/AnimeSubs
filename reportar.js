const formulario =
document.getElementById("reportForm");


const lista =
document.getElementById("listaReportes");


const mensaje =
document.getElementById("mensaje");



let reportes = JSON.parse(

localStorage.getItem("reportes")

) || [];





limpiarReportes();

mostrarReportes();







formulario.addEventListener("submit", function(e){


e.preventDefault();



let reporte = {


problema:
document.getElementById("problema").value,


usuario:
document.getElementById("usuario").value || "Anonimo",


fecha:
Date.now()


};






reportes.push(reporte);





localStorage.setItem(

"reportes",

JSON.stringify(reportes)

);






mensaje.textContent =

"Reporte enviado correctamente";





formulario.reset();





mostrarReportes();






setTimeout(()=>{


mensaje.textContent = "";


},5000);



});









function limpiarReportes(){



let ahora = Date.now();




reportes = reportes.filter(reporte=>{



if(!reporte.fecha){


reporte.fecha = ahora;


}





let dias =


(ahora - reporte.fecha)

/


(1000 * 60 * 60 * 24);






return dias < 14;



});





localStorage.setItem(

"reportes",

JSON.stringify(reportes)

);



}









function tiempoPublicado(fecha){



let dias = Math.floor(



(Date.now() - fecha)

/


(1000 * 60 * 60 * 24)



);






if(dias <= 0){


return "Se reporto hoy";


}





return "Se reporto hace " + dias + "d";



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









function mostrarReportes(){



limpiarReportes();




lista.innerHTML = "";






if(reportes.length === 0){



lista.innerHTML = `


<p style="text-align:center;color:#888">


No hay problemas reportados


</p>


`;



return;



}









reportes.sort((a,b)=> a.fecha - b.fecha);


[...reportes].reverse().forEach(reporte=>{



let div = document.createElement("div");



div.className = "reporte";






div.innerHTML = `



<p>

${reporte.problema}

</p>





<span>

Reportado por: ${reporte.usuario}

</span>






<div class="recommend-time">



<p>

${tiempoPublicado(reporte.fecha)}

</p>





<p>

${tiempoBorrado(reporte.fecha)}

</p>




</div>



`;






lista.appendChild(div);



});



}