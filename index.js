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
                    <a href="#" class="btn btn-primary nuevoBtn">Go somewhere</a>
                </div>
              </div>
            </div>
        </div>
    </div>
    
    `;
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
}

main();
