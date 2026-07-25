let animeList = [];

// =========================
// PAGINACIÓN
// =========================

const ANIMES_PER_PAGE = 50;

let currentPage = 1;

let filteredAnime = [];

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

const grid = document.getElementById("animeGrid");

const continueGrid = document.getElementById("continueGrid");

const latestGrid = document.getElementById("latestGrid");

const continueSection = document.getElementById("continueSection");

const search = document.getElementById("search");

const clearSearch = document.getElementById("clearSearch");

const suggestions = document.getElementById("suggestions");


const genreFilter = document.getElementById("genreFilter");

const typeFilter = document.getElementById("typeFilter");

const statusFilter = document.getElementById("statusFilter");

const sortFilter = document.getElementById("sortFilter");

const randomAnime = document.getElementById("randomAnime");



// Cargar anime.json
function showLoading(){

    grid.innerHTML = "";

    for(let i = 0; i < 8; i++){

        grid.innerHTML += `

        <div class="skeleton-card">

            <div class="skeleton-image"></div>


            <div class="skeleton-info">

                <div class="skeleton-line"></div>

                <div class="skeleton-line small"></div>

            </div>

        </div>

        `;

    }

}


showLoading();

fetch("anime.json")

.then(response => response.json())

.then(data => {


    animeList = data;

filteredAnime = [...animeList];

loadGenres();

showAnime(filteredAnime);

loadContinue();

loadLatest();
})


.catch(error => {


console.error(
"Error cargando anime:",
error
);


});









// Cargar géneros

function loadGenres(){


let genres = [];



animeList.forEach(anime=>{


anime.genres.forEach(genre=>{


if(!genres.includes(genre)){


genres.push(genre);


}


});


});





genres.sort();





genres.forEach(genre=>{


genreFilter.innerHTML += `

<option value="${genre}">

${genre}

</option>

`;


});


}









// Mostrar animes

function showAnime(list, updateList = true){

if(updateList){
    filteredAnime = list;
}

const start = (currentPage - 1) * ANIMES_PER_PAGE;
const end = start + ANIMES_PER_PAGE;

const pageAnime = filteredAnime.slice(start, end);

grid.innerHTML = "";



if(list.length === 0){


grid.innerHTML = `

<h2 style="
grid-column:1/-1;
text-align:center;
color:#aaa;
padding:40px;
">

No se encontro ningun anime

</h2>

`;


return;


}





let html = "";

pageAnime.forEach(anime=>{


html += `


<div class="card">


<div class="image-box">


<img
loading="lazy"
src="${anime.image}"
alt="${anime.title}">

<div class="favorite-star ${isFavorite(anime.id) ? "active" : ""}"

onclick="toggleFavorite(${anime.id}, this)">

${isFavorite(anime.id) ? "★" : "☆"}

</div>

<span class="status">

${anime.status}

</span>



<span class="type">

${getType(anime.type)}

</span>



</div>





<div class="card-info">



<h3>

${anime.title}

</h3>



<p>

🎭 ${anime.genres.join(" • ")}

</p>



<p>

📅 ${anime.year}

</p>



<p>

⭐ ${anime.rating}

</p>




<button onclick="openAnime(${anime.id})">

Ver ahora ▶

</button>



</div>



</div>



`;



});

grid.innerHTML = html;

updatePagination();

}



// =========================
// PAGINACIÓN
// =========================

function updatePagination(){

    const totalPages = Math.max(
        1,
        Math.ceil(filteredAnime.length / ANIMES_PER_PAGE)
    );

    pageInfo.textContent =
        `Pagina ${currentPage} de ${totalPages}`;

    prevPageBtn.disabled = currentPage === 1;

    nextPageBtn.disabled = currentPage === totalPages;

}





// Tipo

function getType(type){


if(type === "Serie"){

return "Serie";

}


if(type === "Pelicula"){

return "Pelicula";

}


if(type === "OVA"){

return "OVA";

}


if(type === "Especial"){

return "Especial";

}


return type;


}









// Aplicar filtros

function applyFilters(){


let result = [...animeList];



const text = search.value
.toLowerCase()
.trim()
.replace(/\s+/g," ");





result = result.filter(anime=>{


let searchMatch =

anime.title.toLowerCase().includes(text)

||

anime.genres.some(genre =>

genre.toLowerCase().includes(text)

)

||

String(anime.year).includes(text)

||

String(anime.rating).includes(text);





let genreMatch =

genreFilter.value === "all"

||

anime.genres.includes(
genreFilter.value
);





let typeMatch =

typeFilter.value === "all"

||

anime.type === typeFilter.value;

let statusMatch =

statusFilter.value === "all"

||

anime.status === statusFilter.value;



return (

searchMatch &&

genreMatch &&

typeMatch &&

statusMatch

);


});









// Ordenar nombre A-Z

if(sortFilter.value === "nameAZ"){


result.sort((a,b)=>

a.title.localeCompare(b.title)

);


}







// Ordenar nombre Z-A

if(sortFilter.value === "nameZA"){


result.sort((a,b)=>

b.title.localeCompare(a.title)

);


}







// Fecha nueva

if(sortFilter.value === "new"){


result.sort((a,b)=>

Number(b.year)-Number(a.year)

);


}







// Fecha vieja

if(sortFilter.value === "old"){


result.sort((a,b)=>

Number(a.year)-Number(b.year)

);


}







// Tipo

if(sortFilter.value === "type"){


result.sort((a,b)=>

a.type.localeCompare(b.type)

);


}

// Mejor clasificado

if(sortFilter.value === "rating"){

result.sort((a,b)=>

Number(b.rating)-Number(a.rating)

);

}





// Últimos agregados

if(sortFilter.value === "latest"){


result.sort((a,b)=>

b.id - a.id

);


}



currentPage = 1;

showAnime(result);


}









// Buscador

search.addEventListener(

"input",

()=>{


applyFilters();




if(search.value.length > 0){


clearSearch.style.display="block";


showSuggestions();


}

else{


clearSearch.style.display="none";


suggestions.style.display="none";


}



}

);









// Sugerencias

function showSuggestions(){


let text = search.value.toLowerCase().trim();




let results = animeList.filter(anime=>{


return anime.title

.toLowerCase()

.startsWith(text);



}).slice(0,5);






suggestions.innerHTML = "";






if(results.length === 0){


suggestions.style.display="none";


return;


}






results.forEach(anime=>{


suggestions.innerHTML += `


<div class="suggestion"

onclick="selectAnime('${anime.title}')">


${anime.title}


</div>


`;



});






suggestions.style.display="block";


}









// Elegir sugerencia

function selectAnime(title){


search.value = title;


suggestions.style.display="none";


applyFilters();


}









// Limpiar búsqueda

clearSearch.addEventListener(

"click",

()=>{


search.value="";


clearSearch.style.display="none";


suggestions.style.display="none";


applyFilters();


}

);









// Ocultar sugerencias al clicar fuera

document.addEventListener(

"click",

(e)=>{


if(!e.target.closest(".search")){


suggestions.style.display="none";


}


}

);









// Filtros

genreFilter.addEventListener(

"change",

applyFilters

);



typeFilter.addEventListener(

"change",

applyFilters

);

statusFilter.addEventListener(
"change",
applyFilters
);

sortFilter.addEventListener(

"change",

applyFilters

);



prevPageBtn.addEventListener("click",()=>{

    if(currentPage > 1){

        currentPage--;

        showAnime(filteredAnime, false);

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    }

});



nextPageBtn.addEventListener("click",()=>{

    const totalPages = Math.ceil(
        filteredAnime.length / ANIMES_PER_PAGE
    );

    if(currentPage < totalPages){

        currentPage++;

        showAnime(filteredAnime, false);

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    }

});





// Abrir anime

function openAnime(id){


window.location.href =

"anime.html?id="+id;


}

const menuButton = document.getElementById("menuButton");

const menuDropdown = document.getElementById("menuDropdown");


const closeMenu = document.getElementById("closeMenu");

const themeButton = document.getElementById("themeButton");

const themeOptions = document.getElementById("themeOptions");



menuButton.addEventListener("click",()=>{

    menuDropdown.style.display="block";

});



closeMenu.addEventListener("click",()=>{

    menuDropdown.style.display="none";

});



themeButton.addEventListener("click",()=>{


    if(themeOptions.style.display === "block"){

        themeOptions.style.display="none";

    }else{

        themeOptions.style.display="block";

    }


});

function updateFavCount(){


const count = document.getElementById("favCount");


if(!count) return;



let favorites = JSON.parse(

localStorage.getItem("favorites")

) || [];



count.textContent = "(" + favorites.length + ")";


}



updateFavCount();

 // =========================
// FAVORITOS
// =========================


function getFavorites(){


    return JSON.parse(

        localStorage.getItem("favorites")

    ) || [];


}





function isFavorite(id){


    return getFavorites().includes(id);


}







function toggleFavorite(id, element){


    let favorites = getFavorites();




    if(favorites.includes(id)){


        favorites = favorites.filter(

            animeId => animeId !== id

        );



        element.textContent = "☆";

        element.classList.remove("active");



    }else{


        favorites.push(id);



        element.textContent = "★";

        element.classList.add("active");



    }






    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)

    );





    updateFavCount();



}







function updateFavCount(){



    const count = document.getElementById("favCount");



    if(!count) return;





    let favorites = JSON.parse(

        localStorage.getItem("favorites")

    ) || [];





    count.textContent = "(" + favorites.length + ")";



}





updateFavCount();

function setTheme(theme){


if(theme === "light"){


document.body.classList.add("light");


localStorage.setItem(
"theme",
"light"
);


}



if(theme === "dark"){


document.body.classList.remove("light");


localStorage.setItem(
"theme",
"dark"
);


}


}



const savedTheme = localStorage.getItem("theme");


if(savedTheme === "light"){

document.body.classList.add("light");

}

// =========================
// CONTINUAR VIENDO
// =========================

function loadContinue(){


    const continueGrid = document.getElementById("continueGrid");
    const continueSection = document.getElementById("continueSection");


    if(!continueGrid || !continueSection) return;



    let watching = JSON.parse(
        localStorage.getItem("continueWatching")
    ) || [];



    // eliminar datos rotos

    watching = watching.filter(item => 
        item &&
        item.title &&
        item.image &&
        item.id
    );



    if(watching.length === 0){

        continueSection.style.display = "none";
        continueGrid.innerHTML = "";

        return;

    }



    continueSection.style.display = "block";


    continueGrid.innerHTML = "";



    watching.slice(0,5).forEach(item=>{


        let text;


        if(item.type === "Pelicula"){

            text = "🎥 Pelicula";

        }else{

            text = "📺 Episodio " + item.episode;

        }



        continueGrid.innerHTML += `

        <div class="card">


            <div class="image-box">

                <img 
                loading="lazy"
                src="${item.image}"
                alt="${item.title}">

            </div>



            <div class="card-info">


                <h3>${item.title}</h3>


                <p>${text}</p>


                <button onclick="continueAnime(${item.id}, ${item.episode || 1})">

                Continuar ▶

                </button>


            </div>


        </div>

        `;


    });



}

// =========================
// CONTINUAR ANIME
// =========================

function continueAnime(id, episode){

    window.location.href =
    "anime.html?id=" + id + "&episode=" + episode;

}

// =========================
// ANIME ALEATORIO
// =========================


randomAnime.addEventListener("click",()=>{


    if(filteredAnime.length === 0){

        alert("No hay animes disponibles");

        return;

    }


    const random = filteredAnime[

        Math.floor(
            Math.random() * filteredAnime.length
        )

    ];


    window.location.href =
    "anime.html?id=" + random.id;


});

// =========================
// ULTIMOS AGREGADOS
// =========================

function loadLatest(){


    if(!latestGrid) return;



    let latest = [...animeList];


    latest.sort((a,b)=> b.id - a.id);


    latest = latest.slice(0,5);



    latestGrid.innerHTML = "";



    latest.forEach(anime=>{


        latestGrid.innerHTML += `


        <div class="card">


            <div class="image-box">


                <img
                loading="lazy"
                src="${anime.image}"
                alt="${anime.title}">



                <div class="favorite-star ${isFavorite(anime.id) ? "active" : ""}"

                onclick="toggleFavorite(${anime.id}, this)">

                ${isFavorite(anime.id) ? "★" : "☆"}

                </div>



                <span class="status">

                ${anime.status}

                </span>



                <span class="type">

                ${getType(anime.type)}

                </span>


            </div>





            <div class="card-info">


                <h3>

                ${anime.title}

                </h3>




                <p>

                🎭 ${anime.genres.join(" • ")}

                </p>





                <p>

                📅 ${anime.year}

                </p>





                <p>

                ⭐ ${anime.rating}

                </p>





                <button onclick="openAnime(${anime.id})">

                Ver ahora ▶

                </button>


            </div>


        </div>


        `;


    });


}