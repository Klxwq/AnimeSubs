const container = document.getElementById("historyContainer");

const clearButton = document.getElementById("clearHistory");

const autoDelete = document.getElementById("autoDelete");



let history = JSON.parse(
localStorage.getItem("history")
) || [];



let deleteTime = localStorage.getItem("historyDeleteTime") || "0";

autoDelete.value = deleteTime;



/* =========================
BORRADO AUTOMATICO
========================= */


function cleanHistory(){


let time = Number(
localStorage.getItem("historyDeleteTime")
) || 0;


if(time === 0) return;



let now = Date.now();



history = history.filter(item=>{


return now - item.date < time;


});



localStorage.setItem(
"history",
JSON.stringify(history)
);


}



cleanHistory();





/* =========================
MOSTRAR HISTORIAL
========================= */


function showHistory(){


container.innerHTML="";



if(history.length === 0){


container.innerHTML=`

<div class="empty">

No hay historial

</div>

`;

return;

}





history.reverse().forEach(anime=>{



let card=document.createElement("div");


card.className="history-card";



card.innerHTML=`

<img src="${anime.image}">



<div class="history-info">


<h3>

${anime.title}

</h3>


<p>

Visto hace ${timeAgo(anime.date)}

</p>


</div>

`;





card.onclick=()=>{


window.location.href=

"anime.html?id="+anime.id;


};



container.appendChild(card);



});



}



showHistory();





/* =========================
CAMBIAR BORRADO
========================= */


autoDelete.addEventListener(
"change",
()=>{


localStorage.setItem(

"historyDeleteTime",

autoDelete.value

);



cleanHistory();


showHistory();



});





/* =========================
BORRAR TODO
========================= */


clearButton.addEventListener(
"click",
()=>{


if(confirm("¿Borrar todo el historial?")){


localStorage.removeItem("history");


history=[];


showHistory();


}


});





/* =========================
TIEMPO
========================= */


function timeAgo(date){


let seconds = Math.floor(

(Date.now()-date)/1000

);



if(seconds < 60)

return "unos segundos";



let minutes=Math.floor(
seconds/60
);


if(minutes < 60)

return minutes+" min";



let hours=Math.floor(
minutes/60
);


if(hours < 24)

return hours+"h";



let days=Math.floor(
hours/24
);


if(days < 30)

return days+"d";



let months=Math.floor(
days/30
);


if(months < 12)

return months+" meses";



return Math.floor(months/12)+" año";

}