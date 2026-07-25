const defaultHotkeys = {

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





let hotkeys = JSON.parse(

localStorage.getItem("hotkeys")

) || {...defaultHotkeys};





const buttons = document.querySelectorAll(

".hotkey-card button"

);







function keyName(key){


const names = {


Space:"Espacio",

ArrowRight:"➡ Flecha derecha",

ArrowLeft:"⬅ Flecha izquierda",

ArrowUp:"⬆ Flecha arriba",

ArrowDown:"⬇ Flecha abajo",

F:"F",

M:"M",

N:"N",

B:"B",

"]":"]",

"[":"["


};



return names[key] || key.toUpperCase();


}









function updateKeys(){


buttons.forEach(button=>{


const action = button.dataset.key;


const span = button.parentElement.querySelector("span");



span.textContent = keyName(

hotkeys[action]

);



});


}









buttons.forEach(button=>{



button.addEventListener(

"click",

()=>{


const action = button.dataset.key;



button.textContent = 

"Presiona tecla";





function changeKey(e){



e.preventDefault();



let newKey = e.key;



if(e.code === "Space"){

newKey="Space";

}





// comprobar si ya existe

let used = Object.keys(hotkeys).find(

item =>

item !== action &&

hotkeys[item].toLowerCase() === newKey.toLowerCase()

);






if(used){



alert(

"Esa tecla ya esta usada por otra funcion"

);



button.textContent="Cambiar";



document.removeEventListener(

"keydown",

changeKey

);



return;



}







hotkeys[action]=newKey;





localStorage.setItem(

"hotkeys",

JSON.stringify(hotkeys)

);





button.textContent="Cambiar";



updateKeys();





document.removeEventListener(

"keydown",

changeKey

);



}







document.addEventListener(

"keydown",

changeKey

);



}


);



});









document.getElementById(

"resetHotkeys"

).addEventListener(

"click",

()=>{



hotkeys={...defaultHotkeys};



localStorage.setItem(

"hotkeys",

JSON.stringify(hotkeys)

);



updateKeys();



alert(

"Hotkeys restauradas"

);



}

);







updateKeys();