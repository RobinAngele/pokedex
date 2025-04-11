const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
let currentOffset = 0;
const POKEMON_PER_PAGE = 20;


async function getData(requestedObject) {
    try {
        showLoadingScreen();
        
        let url = `${API_URL}${requestedObject}`;
        let response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Pokémon not found');
        }
        
        let pokemonData = await response.json();
        renderPokemon(pokemonData);
    } catch (error) {
        showErrorMessage(error.message);
    } finally {
        hideLoadingScreen();
    }
}

async function loadInitialPokemon() {
    try {
        showLoadingScreen();
        
        const response = await fetch(`${API_URL}?limit=${POKEMON_PER_PAGE}&offset=${currentOffset}`);
        
        if (!response.ok) throw new Error('Failed to load Pokémon');
        
        const data = await response.json();
        
        currentOffset += POKEMON_PER_PAGE;
        
        await loadPokemonDetails(data.results);
        hideLoadingScreen();
    } catch (error) {
        showErrorMessage(error.message);
        hideLoadingScreen();
    }
}


async function loadMorePokemon() {
    try {
        const loadMoreButton = document.getElementById('load-more');
        if (loadMoreButton) loadMoreButton.disabled = true;
        
        showLoadingScreen();
        
        const response = await fetch(`${API_URL}?limit=${POKEMON_PER_PAGE}&offset=${currentOffset}`);
        if (!response.ok) throw new Error('Failed to load more Pokémon');
        
        const data = await response.json();
        currentOffset += POKEMON_PER_PAGE;
        
        await loadPokemonDetails(data.results);
        
        if (loadMoreButton) loadMoreButton.disabled = false;
        hideLoadingScreen();
    } catch (error) {
        showErrorMessage(error.message);
        if (document.getElementById('load-more')) {
            document.getElementById('load-more').disabled = false;
        }
        hideLoadingScreen();
    }
}

async function loadPokemonDetails(pokemonList) {
    
    try {
        const pokemonPromises = pokemonList.map(pokemon => {
            return fetch(pokemon.url)
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to load ${pokemon.name}`);
                    return response.json();
                });
        });
        
        const pokemonData = await Promise.all(pokemonPromises);
        
        pokemonData.forEach(pokemon => {
            renderPokemon(pokemon);
        });
    } catch (error) {
        showErrorMessage("Failed to load Pokemon details");
    }
}


async function fetchPokemonDetails(pokemonId) {
    try {
        const response = await fetch(`${API_URL}${pokemonId}`);
        if (!response.ok) throw new Error('Pokémon not found');
        return await response.json();
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        throw error;
    }
}