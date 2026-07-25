const params = new URLSearchParams(
    window.location.search
);


const id = Number(params.get("id"));

const startEpisode = Number(params.get("episode")) || 1;

const cover = document.getElementById("cover");
const title = document.getElementById("title");
const genre = document.getElementById("genre");
const type = document.getElementById("type");
const year = document.getElementById("year");
const rating = document.getElementById("rating");
const status = document.getElementById("status");
const description = document.getElementById("description");


const episodeTitle = document.getElementById("episodeTitle");


const episodesBox = document.getElementById("episodes");
const episodesSection = document.getElementById("episodesSection");


const seasonsBox = document.getElementById("seasons");


const videoContainer =
document.querySelector(".video-container");

const iframePlayer =
document.getElementById("iframePlayer");

let player = null;

let currentEpisode = 1;




fetch("anime.json")


.then(response => response.json())


.then(data => {


const anime = data.find(
item => item.id === id
);



if(anime){

loadAnime(anime);

}



})


.catch(error=>{


console.error(
"Error cargando anime:",
error
);


});







function loadAnime(anime){


window.currentAnime = anime;

if(!anime.videoType){

    anime.videoType = "mp4";

}

// =========================
// HISTORIAL
// =========================


let history = JSON.parse(

localStorage.getItem("history")

) || [];



history = history.filter(

item => item.id !== anime.id

);



history.unshift({


id: anime.id,


title: anime.title,


image: anime.image,


date: Date.now()


});



localStorage.setItem(

"history",

JSON.stringify(history)

);







cover.src = anime.image;



title.textContent =
anime.title;



genre.textContent =
"🎭 " + anime.genres.join(" • ");




type.textContent =
getType(anime.type);




year.textContent =
"📅 " + anime.year;




rating.textContent =
"⭐ " + anime.rating;




status.textContent =
getStatus(anime.status);




description.textContent =
anime.description;








// =========================
// SIN EPISODIOS
// =========================


if(!anime.episodes || anime.episodes.length === 0){


showVideoMessage("No disponible");


episodesSection.style.display="none";


loadSeasons(anime);


return;


}








// =========================
// PELICULA
// =========================


if(anime.type === "Pelicula"){


episodesSection.style.display="none";



episodeTitle.textContent =
"Pelicula";



playEpisode(0);



}








// =========================
// SERIE / OVA / ESPECIAL
// =========================


else{


episodesSection.style.display="block";



loadEpisodes(anime);




playEpisode(startEpisode - 1);



}





loadSeasons(anime);



}









function showVideoMessage(text){



if(videoContainer){


videoContainer.innerHTML = `


<div id="playerMessage"></div>


<div class="video-message">

${text}

</div>


`;

}


}








function getType(value){



if(value === "Serie"){


return "📺 Serie";


}



if(value === "Pelicula"){


return "🎥 Pelicula";


}



if(value === "OVA"){


return "📝 OVA";


}



if(value === "Especial"){


return "⭐ Especial";


}



return value;



}









function getStatus(value){



if(value === "Concluido"){


return "✅ Concluido";


}




if(value === "En emision"){


return "🟣 En emision";


}





if(value === "No disponible"){


return "❌ No disponible";


}





if(value === "Descontinuado"){


return "⚫ Descontinuado";


}





return value;



}

// =========================
// CARGAR EPISODIOS
// =========================


function loadEpisodes(anime){

    episodesBox.innerHTML = "";

    anime.episodes.forEach((episode,index)=>{

        if(!episode || !episode.url){

            episodesBox.innerHTML += `

            <div class="episode-card disabled">

                <div class="episode-name">

                    No disponible

                </div>

            </div>

            `;

        }

        else{

            episodesBox.innerHTML += `

            <div class="episode-card"
            onclick="playEpisode(${index})">

                <div class="episode-name">

                    Episodio ${episode.number}

                </div>

            </div>

            `;

        }

    });

}








// =========================
// REPRODUCIR EPISODIO
// =========================


function playEpisode(index){

    const episode = window.currentAnime.episodes[index];

    currentEpisode = index + 1;

    if(!episode || !episode.url){

        showVideoMessage("No disponible");

        return;

    }

    const url = episode.url;
    const type = episode.type;

    if(videoContainer.querySelector(".video-message")){

        videoContainer.innerHTML = `

        <div id="playerMessage"></div>

        <video id="video" controls></video>

        <iframe
        id="iframePlayer"
        allowfullscreen
        allow="autoplay; fullscreen"
        frameborder="0">
        </iframe>

        `;

    }

    const video = document.getElementById("video");
    const iframe = document.getElementById("iframePlayer");

if(player){
    player.destroy();
    player = null;
}

    if(type === "mp4"){

        iframe.style.display = "none";
        iframe.src = "";

        video.style.display = "block";
        video.src = url;

player = new Plyr(video,{

controls:[
'play-large',
'play',
'progress',
'current-time',
'mute',
'volume',
'settings',
'pip',
'airplay',
'fullscreen'
],

settings:[
'speed'
],

speed:{
selected:1,
options:[
0.5,
0.75,
1,
1.25,
1.5,
2,
3,
4,
5
]
}

});

player.play().catch(()=>{});

        video.onerror = ()=>{

            showVideoMessage("No disponible");

        };

    }

    else if(type === "embed" || type === "youtube"){

    if(player){
        player.pause();
        player.destroy();
        player = null;
    }

    video.removeAttribute("src");
    video.load();

    video.style.display = "none";

    iframe.style.display = "block";
    iframe.src = url;

}

    saveContinue(window.currentAnime.id,currentEpisode);

}












// =========================
// TEMPORADAS
// =========================


function loadSeasons(anime){


seasonsBox.innerHTML="";



if(

!anime.otherSeasons ||

anime.otherSeasons.length === 0

){


return;


}






anime.otherSeasons.forEach(season=>{





seasonsBox.innerHTML += `



<div class="season-card">


<h3>

${season.title}

</h3>





<button onclick="${

season.link

?

`goSeason('${season.link}')`

:

`goRecommend()`

}">


${

season.link

?

"Ver"

:

"Recomendar"

}


</button>



</div>



`;



});



}








function goSeason(link){


window.location.href = link;


}







function goRecommend(){


window.location.href="recomendar.html";


}







// =========================
// CONTINUAR VIENDO
// =========================


function saveContinue(id, episode){


    const anime = window.currentAnime;


    if(!anime) return;



    let watching = JSON.parse(
        localStorage.getItem("continueWatching")
    ) || [];



    // quitar repetido

    watching = watching.filter(
        item => item.id !== id
    );



    watching.unshift({

        id: anime.id,

        title: anime.title,

        image: anime.image,

        type: anime.type,

        episode: episode

    });



    // máximo 10 guardados

    watching = watching.slice(0,10);



    localStorage.setItem(
        "continueWatching",
        JSON.stringify(watching)
    );


}

// =========================
// SIGUIENTE / ANTERIOR
// =========================


function nextEpisode(){


if(!window.currentAnime) return;



const anime = window.currentAnime;



if(currentEpisode >= anime.episodes.length){


playerMessage("No hay mas episodios");


return;


}




const next = currentEpisode + 1;




if(!anime.episodes[next-1] || !anime.episodes[next-1].url){


playerMessage("No disponible");


return;


}





playEpisode(next - 1);



playerMessage(

"⏭ Episodio " + next

);



}









function previousEpisode(){



if(!window.currentAnime) return;



if(currentEpisode <= 1){


playerMessage("Primer episodio");


return;


}






const prev = currentEpisode - 1;




playEpisode(prev - 1);



playerMessage(

"⏮ Episodio " + prev

);



}









// =========================
// MENSAJES DEL REPRODUCTOR
// =========================



let playerMessageTimeout;




function playerMessage(text){



const box = document.getElementById(

"playerMessage"

);



if(!box) return;




clearTimeout(playerMessageTimeout);




box.textContent = text;



box.classList.add("show");




playerMessageTimeout = setTimeout(()=>{


box.classList.remove("show");


},1000);



}









// =========================
// HOTKEYS GUARDADAS
// =========================



let hotkeys = JSON.parse(

localStorage.getItem("hotkeys")

) || {



space:"Space",


right:"ArrowRight",


left:"ArrowLeft",


up:"ArrowUp",


down:"ArrowDown",


fullscreen:"F",


mute:"M",


next:"N",


previous:"B",


speedUp:"]",


speedDown:"["



};

// =========================
// ATAJOS DEL REPRODUCTOR
// =========================


let savedHotkeys = JSON.parse(

localStorage.getItem("hotkeys")

) || {


space:"Space",

right:"ArrowRight",

left:"ArrowLeft",

up:"ArrowUp",

down:"ArrowDown",

fullscreen:"f",

mute:"m",

next:"n",

previous:"b",

speedUp:"]",

speedDown:"["

};







document.addEventListener("keydown",function(e){



const video = document.getElementById("video");



if(!video) return;





// No usar mientras escribes

if(

document.activeElement.tagName === "INPUT" ||

document.activeElement.tagName === "TEXTAREA"

){

return;

}






// PAUSA


if(
    (
        e.code === "Space" &&
        savedHotkeys.space === "Space"
    )
    ||
    e.key.toLowerCase() === savedHotkeys.space.toLowerCase()
){


e.preventDefault();


if(video.paused){


video.play();


playerMessage("▶ Reproduciendo");


}

else{


video.pause();


playerMessage("⏸ Pausado");


}


}









// RETROCEDER


if(e.key === savedHotkeys.left){


video.currentTime -= 5;


playerMessage("⏪ -5 s");


}







// ADELANTAR


if(e.key === savedHotkeys.right){


video.currentTime += 5;


playerMessage("⏩ +5 s");


}







// SUBIR VOLUMEN


if(e.key === savedHotkeys.up){


e.preventDefault();



video.volume=Math.min(

1,

video.volume+0.05

);



playerMessage(

"🔊 "+Math.round(video.volume*100)+"%"

);


}







// BAJAR VOLUMEN


if(e.key === savedHotkeys.down){


e.preventDefault();



video.volume=Math.max(

0,

video.volume-0.05

);



playerMessage(

"🔉 "+Math.round(video.volume*100)+"%"

);


}








// VELOCIDAD MENOS


if(e.key === savedHotkeys.speedDown){


video.playbackRate=Math.max(

0.25,

video.playbackRate-0.25

);



playerMessage(

"⚡ "+video.playbackRate.toFixed(2)+"x"

);


}








// VELOCIDAD MAS


if(e.key === savedHotkeys.speedUp){


video.playbackRate=Math.min(

4,

video.playbackRate+0.25

);



playerMessage(

"⚡ "+video.playbackRate.toFixed(2)+"x"

);


}








// SILENCIO


if(e.key.toLowerCase() === savedHotkeys.mute.toLowerCase()){



video.muted=!video.muted;



playerMessage(

video.muted

?

"🔇 Silenciado"

:

"🔊 Sonido"

);


}









// PANTALLA COMPLETA


if(e.key.toLowerCase() === savedHotkeys.fullscreen.toLowerCase()){



if(!document.fullscreenElement){


video.requestFullscreen();


playerMessage(

"📺 Pantalla completa"

);


}

else{


document.exitFullscreen();


playerMessage(

"↩ Salir pantalla completa"

);


}


}








// SIGUIENTE EPISODIO


if(e.key.toLowerCase() === savedHotkeys.next.toLowerCase()){



nextEpisode();


playerMessage(

"⏭ Siguiente episodio"

);


}








// EPISODIO ANTERIOR


if(e.key.toLowerCase() === savedHotkeys.previous.toLowerCase()){



previousEpisode();


playerMessage(

"⏮ Episodio anterior"

);


}



});

// =========================
// SIGUIENTE EPISODIO AUTOMATICO
// =========================

let nextTimer;
let countdown = 10;


function autoNextEpisode(){


if(!window.currentAnime) return;


const anime = window.currentAnime;



if(currentEpisode >= anime.episodes.length){

return;

}



countdown = 10;



showNextMessage();



nextTimer = setInterval(()=>{


countdown--;



showNextMessage();



if(countdown <= 0){


clearInterval(nextTimer);


nextEpisode();


}


},1000);



}







function showNextMessage(){


const box = document.getElementById("playerMessage");



if(!box) return;



box.innerHTML = `

▶ Siguiente episodio en ${countdown}

<br>

<button onclick="cancelNext()">

Cancelar

</button>

`;



box.classList.add("show");


}







function cancelNext(){


clearInterval(nextTimer);



const box = document.getElementById("playerMessage");


if(box){


box.classList.remove("show");


}



}

function continueAnime(id, episode){

    window.location.href =
    "anime.html?id=" + id + "&episode=" + episode;

}