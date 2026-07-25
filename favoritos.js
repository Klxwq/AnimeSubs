const grid = document.getElementById("favoritesGrid");



let favorites = JSON.parse(

localStorage.getItem("favorites")

) || [];





fetch("anime.json")

.then(response => response.json())

.then(animes => {



    let favAnime = animes.filter(anime =>

        favorites.includes(anime.id)

    );



    showFavorites(favAnime);



})

.catch(error => {

    console.error(
        "Error cargando favoritos:",
        error
    );

});









function showFavorites(list){


grid.innerHTML = "";





if(list.length === 0){


grid.innerHTML = `


<div class="empty">


No tienes animes favoritos


</div>


`;


return;


}







list.forEach(anime => {



grid.innerHTML += `


<div class="card">


<img src="${anime.image}"

alt="${anime.title}">





<div class="info">


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


▶ Ver anime


</button>





<button onclick="removeFavorite(${anime.id})">


❌ Quitar de favoritos


</button>





</div>


</div>



`;



});



}









function removeFavorite(id){



let favorites = JSON.parse(

localStorage.getItem("favorites")

) || [];





favorites = favorites.filter(

animeId => animeId !== id

);





localStorage.setItem(

"favorites",

JSON.stringify(favorites)

);





location.reload();



}









function openAnime(id){


window.location.href =

"anime.html?id=" + id;


}