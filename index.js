//array de carrito de peliculas faveadas
let cart = [];



//alerta success
const alertaSuccess = () => {
  Swal.fire({
    icon: "success",
    text: "Pelicula faveada con exito!",
  });
};
//alerta error
const alertaError = () => {
  Swal.fire({
    icon: "error",
    text: "Pelicula ya guardada!",
  });
};


//funcion encargada de guardar las peliculas faveadas en el localstorage
function saveCart(peliId) {
  
  if (localStorage.getItem("cart"))/* si ya entre previamente al localstorage */ {
		let loadedCart = JSON.parse(localStorage.getItem("cart"));
    console.log("entre previamente al localstorage")
    console.log(loadedCart) //array de objetos
    console.log(peliId)
    
		let estaOno =  loadedCart.some(peli => peli.id === parseInt(peliId))
    console.log(estaOno)
    
    if(estaOno){
      alertaError()
    }else{
      localStorage.clear()
      localStorage.setItem("cart", JSON.stringify(cart));
      alertaSuccess()
    }
}else{
  //si es la primera vez que entro
  localStorage.setItem("cart", JSON.stringify(cart));
  alertaSuccess()
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
  console.log(parametroBusqueda);
  console.log(listaPeliculas);
  const pelisFiltradasPorTitulo = listaPeliculas.filter((peli) =>
    peli.title.toLowerCase().includes(parametroBusqueda.toLowerCase())
  );
  console.log(pelisFiltradasPorTitulo);
  if (pelisFiltradasPorTitulo.length > 0) {
    recorrerPeliculas(pelisFiltradasPorTitulo);
  }
}

//inicio de aplicacion
function main() {
  recorrerPeliculas(listaPeliculas);

  const inputBusqueda = document.querySelector("#search-busqueda-pelis");

  inputBusqueda.addEventListener("keyup", (e) => {
    busqueda(e.target.value);
  });

  likeButtons();
}

main();
