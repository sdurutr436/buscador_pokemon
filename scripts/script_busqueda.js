/* 
 * La constante url contiene la URL base de la API de Pokémon.
 * La variable seccionBuscador hace referencia al campo de entrada donde el usuario ingresa el nombre del Pokémon.
 * La variable seccionBusqueda hace referencia a la sección donde se mostrarán los resultados de la búsqueda.
 */

const seccionBuscador = document.querySelector("#pokemonNameInput");
const seccionResult = document.getElementById("pokemonResult");
const gestionError = document.getElementById("gestionError");
const modal = document.getElementById("modalPokemon");
const overlay = document.getElementById("modalOverlay");
let listaPokemons = [];
let listaDetalles = [];

// ---- FUNCIONES UTILITARIAS ---- //

// Función para renderizar cartas reutilizable
function pintarPokemonsEnContenedor(arrayPokemons) {
    let html = "";
    arrayPokemons.forEach(pokemon => {
        html += generarCartaPokemon(pokemon);
    });
    seccionResult.innerHTML = html;
    // Limpia cualquier error si hay resultados
    if (arrayPokemons.length === 0) {
        mostrarError("No se encontraron coincidencias");
    } else {
        gestionError.innerHTML = "";
    }
}

// Función que genera el pequeño bloque de la pequeña carta pkmn
function generarCartaPokemon(datosPokemon) {
    let idPokemon = datosPokemon.id;
    let nombrePokemon = datosPokemon.name;
    let tiposPokemon = generarSpansTipos(datosPokemon.types);
    let imagenPokemon = datosPokemon.sprites.other["official-artwork"].front_default;

    return `
    <article class="pokemon-card" data-id="${idPokemon}">
    <h2 class="pokemon-name">${nombrePokemon}</h2>
    <img src="${imagenPokemon}" alt="${nombrePokemon}" class="pokemon-image">
    <p class="pokemon-types">${tiposPokemon}</p>
    </article>
    `;
}

// Crea los spans de tipo, con clase según el tipo
function generarSpansTipos(typesArray) {
  return typesArray.map(tipoObj => {
    let tipo = tipoObj.type.name;
    return `<span class="pokemon-type tipo-${tipo}">${tipo}</span>`;
  }).join(" ");
}

function mostrarDetallesPkmn(datosPkmn) {
    let nombrePkmn = datosPkmn.name;
    let tiposHTML = generarSpansTipos(datosPkmn.types);

    const spriteOficial = datosPkmn.sprites.other['official-artwork'].front_default;
    const spriteFrontShiny = datosPkmn.sprites.other['official-artwork'].front_shiny;

    const sprites = [
        spriteOficial,
        spriteFrontShiny,
    ].filter(url => url);

    const numeroPokedex = datosPkmn.id;
    const altura = datosPkmn.height / 10;
    const peso = datosPkmn.weight / 10;

    const htmlModal = `
    <div class="modal-content">
        <button class="close-modal">&times;</button>
        <div class="modal-header">
        <h2 class="modal-nombre">${nombrePkmn}</h2>
        <span class="modal-pokedex">N.º ${numeroPokedex}</span>
        </div>
        <div class="modal-types">${tiposHTML}</div>
        <div class="modal-sprites">
        <h3>Sprites</h3>
        <div class="gallery-sprites">
            ${sprites.map(url => `<img src="${url}" class="modal-sprite" alt="sprite ${nombrePkmn}">`).join("")}
        </div>
        </div>
        <div class="modal-metrics">
        <h3>Datos</h3>
        <ul>
            <li><strong>Altura:</strong> ${altura} m</li>
            <li><strong>Peso:</strong> ${peso} kg</li>
        </ul>
        </div>
    </div>
    `;

    modal.innerHTML = htmlModal;
    modal.classList.remove("oculto");
    overlay.classList.remove("oculto");
    
    // Añadir listeners para cerrar
    modal.querySelector('.close-modal').onclick = cerrarModal;
    overlay.onclick = cerrarModal;
}

// ---- FIN BLOQUE FUNCIONES UTILITARIAS ---- //

// Función para mostrar errores
function mostrarError(msg) {
    gestionError.innerHTML = `<p>${msg}</p>`;
}

// Función para cerrar modal
function cerrarModal() {
    modal.classList.add('oculto');
    overlay.classList.add('oculto');
}

// Carga y pinta todos los pokémon al iniciar
async function cargarTodosPokemon() {
    seccionResult.innerHTML = "Cargando todos los Pokémon...";
    gestionError.innerHTML = "";
    const pkmnTotal = await fetch("https://pokeapi.co/api/v2/pokemon?limit=3000"); 
    const datos = await pkmnTotal.json();
    listaPokemons = datos.results;

    // Obtener detalles de todos los pokémon (PUEDE TARDAR)
    listaDetalles = [];
    for (let pokemon of listaPokemons) {
        let respuesta = await fetch(pokemon.url);
        let detallesPkmn = await respuesta.json();
        listaDetalles.push(detallesPkmn);
    }
    pintarPokemonsEnContenedor(listaDetalles);
}

// Buscar entre los pokémon ya cargados
function buscarPokemon() {
    let busqueda = seccionBuscador.value.toLowerCase().trim();
    if (!busqueda) {
        pintarPokemonsEnContenedor(listaDetalles);
        return;
    }
    // Filtra los detalles completos por coincidencia de nombre
    let filtrados = listaDetalles.filter(pokemon => 
        pokemon.name.toLowerCase().includes(busqueda)
    );
    pintarPokemonsEnContenedor(filtrados);
}

seccionBuscador.addEventListener("input", buscarPokemon);

seccionResult.addEventListener("click", function(event) {
    let card = event.target.closest('.pokemon-card');
    if (card) {
        let id = card.getAttribute('data-id');
        // Buscar el objeto completo y pasarlo a la función
        let detalles = listaDetalles.find(pkmn => String(pkmn.id) === String(id));
        if (detalles) {
            mostrarDetallesPkmn(detalles);
        }
    }
});

// Ejecuta la carga al iniciar la página
window.addEventListener("DOMContentLoaded", cargarTodosPokemon);
