const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
let currentOffset = 0;
const POKEMON_PER_PAGE = 20;
let allPokemonNames = [];

async function getData(requestedObject) {
    try {
        showLoadingScreen();
        const pokemonData = await fetchPokemonData(requestedObject);
        renderPokemon(pokemonData, true); // true indicates single Pokémon view
    } catch (error) {
        showErrorMessage(error.message);
    } finally {
        hideLoadingScreen();
    }
}

async function fetchPokemonData(requestedObject) {
    const url = `${API_URL}${requestedObject}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Pokémon not found');
    }
    
    return await response.json();
}

async function loadInitialPokemon() {
    try {
        showLoadingScreen();
        await fetchAndRenderPokemon(0);
        hideLoadingScreen();
    } catch (error) {
        handlePokemonLoadError(error);
    }
}

async function fetchAndRenderPokemon(offset) {
    const data = await fetchPokemonBatch(offset);
    currentOffset += POKEMON_PER_PAGE;
    await loadPokemonDetails(data.results);
}

async function fetchPokemonBatch(offset) {
    const response = await fetch(`${API_URL}?limit=${POKEMON_PER_PAGE}&offset=${offset}`);
    
    if (!response.ok) throw new Error('Failed to load Pokémon');
    
    return await response.json();
}

async function loadMorePokemon() {
    try {
        disableLoadMoreButton(true);
        showLoadingScreen();
        await fetchAndRenderPokemon(currentOffset);
        disableLoadMoreButton(false);
        hideLoadingScreen();
    } catch (error) {
        handleMorePokemonError(error);
    }
}

function disableLoadMoreButton(disabled) {
    const loadMoreButton = document.getElementById('load-more');
    if (loadMoreButton) loadMoreButton.disabled = disabled;
}

function handleMorePokemonError(error) {
    showErrorMessage(error.message);
    disableLoadMoreButton(false);
    hideLoadingScreen();
}

function handlePokemonLoadError(error) {
    showErrorMessage(error.message);
    hideLoadingScreen();
}

async function loadPokemonDetails(pokemonList) {
    try {
        const pokemonPromises = createPokemonPromises(pokemonList);
        const pokemonData = await Promise.all(pokemonPromises);
        renderPokemonCollection(pokemonData);
    } catch (error) {
        showErrorMessage("Failed to load Pokémon details");
    }
}

function createPokemonPromises(pokemonList) {
    return pokemonList.map(pokemon => {
        return fetch(pokemon.url)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${pokemon.name}`);
                return response.json();
            });
    });
}

function renderPokemonCollection(pokemonData) {
    pokemonData.forEach(pokemon => {
        renderPokemon(pokemon);
    });
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

async function fetchAllPokemonNames() {
    try {
        const totalCount = await fetchPokemonCount();
        await fetchAndProcessAllNames(totalCount);
    } catch (error) {
        console.error('Error fetching Pokémon names:', error);
    }
}

async function fetchPokemonCount() {
    const countResponse = await fetch(`${API_URL}`);
    if (!countResponse.ok) throw new Error('Failed to fetch Pokémon count');
    
    const countData = await countResponse.json();
    return countData.count;
}

async function fetchAndProcessAllNames(totalCount) {
    const response = await fetch(`${API_URL}?limit=${totalCount}`);
    if (!response.ok) throw new Error('Failed to load Pokémon names');
    
    const data = await response.json();
    processAllPokemonNames(data.results);
}

function processAllPokemonNames(results) {
    allPokemonNames = results.map(pokemon => ({
        name: formatPokemonName(pokemon.name),
        id: extractPokemonId(pokemon.url)
    }));
}

function extractPokemonId(url) {
    const parts = url.split('/');
    return parts[parts.length - 2];
}