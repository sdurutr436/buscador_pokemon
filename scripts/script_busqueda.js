/* 
 * La constante url contiene la URL base de la API de Pokémon.
 * La variable seccionBuscador hace referencia al campo de entrada donde el usuario ingresa el nombre del Pokémon.
 * La variable seccionBusqueda hace referencia a la sección donde se mostrarán los resultados de la búsqueda.
 */

const seccionBuscador = document.querySelector("#pokemonNameInput");
const seccionResult = document.getElementById("pokemonResult");
const gestionError = document.getElementById("gestionError");
let listaPokemons = [];
let listaDetalles = [];

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

// Función que genera la carta de cada pokémon
function generarCartaPokemon(datosPokemon) {
    const nombrePokemon = datosPokemon.name;
    const imagenPokemon = datosPokemon.sprites.other["official-artwork"].front_default;
    const tiposPokemon = datosPokemon.types.map(tipo => tipo.type.name).join(" - ");
    return `
        <article class="pokemon-card">
            <h2 class="pokemon-name">${nombrePokemon}</h2>
            <img src="${imagenPokemon}" alt="${nombrePokemon}" class="pokemon-image">
            <p class="pokemon-types"><strong>Tipos:</strong> ${tiposPokemon}</p>
        </article>
    `;
}

// Función para mostrar errores
function mostrarError(msg) {
    gestionError.innerHTML = `<p>${msg}</p>`;
}

// Carga y pinta todos los pokémon al iniciar
async function cargarTodosPokemon() {
    seccionResult.innerHTML = "Cargando todos los Pokémon...";
    gestionError.innerHTML = "";
    const pkmnTotal = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100"); 
    const datos = await pkmnTotal.json();
    listaPokemons = datos.results;

    // Obtener detalles de todos los pokémon (PUEDE TARDAR)
    listaDetalles = [];
    for (const pokemon of listaPokemons) {
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
    const filtrados = listaDetalles.filter(pokemon => 
        pokemon.name.toLowerCase().includes(busqueda)
    );
    pintarPokemonsEnContenedor(filtrados);
}

seccionBuscador.addEventListener("input", buscarPokemon);

// Ejecuta la carga al iniciar la página
window.addEventListener("DOMContentLoaded", cargarTodosPokemon);
