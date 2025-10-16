/* 
 * La constante url contiene la URL base de la API de Pokémon.
 * La variable seccionBuscador hace referencia al campo de entrada donde el usuario ingresa el nombre del Pokémon.
 * La variable seccionBusqueda hace referencia a la sección donde se mostrarán los resultados de la búsqueda.
*/

const url = "https://pokeapi.co/api/v2/";
const seccionBuscador = document.getElementById("pokemonNameInput");
const seccionResult = document.getElementById("pokemonResult");
seccionBuscador.addEventListener("input", buscarPokemon);

// Funcion que toma el nombre del pokemon ingresado y realiza la búsqueda en la API

async function buscarPokemon() {
    const busqueda = seccionBuscador.value.toLowerCase().trim(); // Convertir a minúsculas y eliminar espacios en blanco

    try {
        const respuesta = await fetch(url + "pokemon/" + busqueda); // Realizar la solicitud a la API
        if (!respuesta.ok) {
            return;
        }

        const datosPokemon = await respuesta.json(); // Parsear la respuesta JSON
        const nombrePokemon = datosPokemon.name;
        const imagenPokemon = datosPokemon.sprites.other.home.front_default;
        const tiposPokemon = datosPokemon.types.map(tipo => tipo.type.name).join(", ");

        seccionResult.innerHTML = `
            <article class="pokemon-card">
                <h2 class="pokemon-name">${nombrePokemon}</h2>
                <img src="${imagenPokemon}" alt="${nombrePokemon}" class="pokemon-image">
                <p class="pokemon-types"><strong>Tipos:</strong> ${tiposPokemon}</p>
            </article>
        `;

    } catch (error) {
        return;
    }

}