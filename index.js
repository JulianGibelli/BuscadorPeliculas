//array de carrito de peliculas faveadas
let cart = [];

//array de peliculas que voy a cargar luego de leer mi archivo JSON
let listaPeliculas = []


//alerta
const alerta = (icono,texto) => {
  Swal.fire({
    icon: icono,
    text: texto,
  });
};


//funcion encargada de decirme si hay carrito en localstorage o no
const hayCarritoPrevio = ()=>{
  if(localStorage.getItem("cart")){
    return true
  }else{
    return false
  }
}

//funcion encargada de devolverme lo cargado en localstorage

function loadedCart(){
  return JSON.parse(localStorage.getItem("cart"));
 
}

//funcion encargada de guardar las peliculas faveadas en el localstorage
function saveCart(peliId) {
  
  if (localStorage.getItem("cart"))/* si ya entre previamente al localstorage */ {
		let carritoCargado = loadedCart();   
    
		let estaOno =  carritoCargado.some(peli => peli.id === parseInt(peliId))
    
    
    if(estaOno){
      alerta("error","pelicula ya guardada!")
    }else{
      localStorage.clear()
      localStorage.setItem("cart", JSON.stringify(cart));
      alerta("success","pelicula faveada con exito!")
    }
}else{
  //si es la primera vez que entro
  localStorage.setItem("cart", JSON.stringify(cart));
  alerta("success","Pelicula faveada con exito!")
}

}

//funcion encargada de agregar la pelicula correspondiente por ID en el carrito
//recibe un id y filtra segun el en la lista de peliculas para luego agregarla
function addToCart(peliId) {
  const peliBuscadaPorId = busquedaPeliPorId(peliId);
  cart.push(peliBuscadaPorId); //me guarda localmente las pelis en cart

  //convierto a set mi array para evadir incluir pelis repetidas
  jsonObject = cart.map(JSON.stringify);      
  uniqueSet = new Set(jsonObject); //convierto a SET
  cart = Array.from(uniqueSet).map(JSON.parse); //luego convierto nueamente a array sin duplicados


  saveCart(peliId); //busca guardar en localstorage mi cart
}

//tomo los botones de like desde el html para aplicarle funcionalidad al apretarlos
function likeButtons() {
  const likeButtonsEls = document.querySelectorAll(".nuevoBtn");
  likeButtonsEls.forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(btn.id);
    });
  });
}

const removeChilds = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};

function recorrerPeliculas(queRecorro) {
  const cardContainer = document.querySelector(".card-container");
  removeChilds(cardContainer);
  queRecorro.forEach((peli) => {
    const elDiv = document.createElement("div");
    elDiv.innerHTML = drawCards(peli);
    cardContainer.appendChild(elDiv);
  });
}

function drawCards(peli) {
  return `
    <div class="col h-100 d-flex align-items-stretch">
        <div class="card mb-3 ">
            <img src="${peli.img}" class="card-img-top" alt="..."/>
            <div class="card-body d-flex flex-column">
              <h3 class="card-title">${peli.title}</h3>
              <p class="card-text">
                ${peli.about}
              </p>
              <div class="contenedor-secundario d-flex">
                <div class="tags">
                    <span>${peli.tags[0]}</span>                
                    <span>${peli.tags[1]}</span>                
                </div>
                <div> 
                    <a href="#" id="${peli.id}" class="btn btn-primary nuevoBtn"><span class="material-symbols-outlined">
                    favorite
                    </span></a>
                </div>
              </div>
            </div>
        </div>
    </div>
    
    `;
}

function busquedaPeliPorId(idBusqueda) {
  return (pelisFiltradaPorId = listaPeliculas.find(
    (peli) => peli.id == idBusqueda
  ));
}

function busqueda(parametroBusqueda) {
  
  const pelisFiltradasPorTitulo = listaPeliculas.filter((peli) =>
    peli.title.toLowerCase().includes(parametroBusqueda.toLowerCase())
  );
  
  if (pelisFiltradasPorTitulo.length > 0) {
    recorrerPeliculas(pelisFiltradasPorTitulo);
  }
}

//funcion encargada de levantar el JSON y popular mi listaPeliculas. Es asincronica ya que tiene que interactuar con algo externo.

async function leerBD(){
  //intenta ir y leer el archivo json y parsearlo
  //si podes, populame mi listadepelis con lo que leiste
  //y luego renderizame las cards con eso
  try {
    const response = await fetch("pelis.json")
    const data = await response.json()
    data.forEach((peli)=>{listaPeliculas.push(peli)})
    recorrerPeliculas(listaPeliculas);
    
  } catch (error) {
    //si llegase a haber un error se dispara un sweetalert que indica falla
    alerta("error","Hubo un inconveniente con el servidor, pruebe mas tarde!")
  }finally{
    //luego si todo salio bien o mal, se les da utilidad a los botones de likeado
    likeButtons();
  }
}

//inicio de aplicacion
function main() {

  //se inicia yendo a leer el archivo JSON que contiene la info de las pelis
  leerBD()


  const inputBusqueda = document.querySelector("#search-busqueda-pelis");

  inputBusqueda.addEventListener("keyup", (e) => {
    busqueda(e.target.value);
  });


  const favMoviesCart = document.querySelector("#favMovies")
  favMoviesCart.addEventListener("click",(e)=>{
    e.preventDefault()
    //tengo que ver si ya tengo carrito o no guardado
    //si no tengo, debo ejecutar una alerta indicando que no hay peliculas guardadas
    //si hay carrito debo renderizar las peliculas alli guardadas
    console.log("entre por click")
    if (hayCarritoPrevio()) {
      //recorre y renderiza las pelis de alli
      recorrerPeliculas(loadedCart())
    } else {
      alerta("error","No tenes peliculas guardadas!")
    }
    likeButtons()
  })

}

main();
