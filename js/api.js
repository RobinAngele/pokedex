const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
let currentOffset = 0;
const POKEMON_PER_PAGE = 20;
let allPokemonNames = [];

async function getData(obj) {
    try {
        showLoadingScreen();
        const data = await fetchPokemonData(obj);
        renderPokemon(data, true);
    } catch (error) {
        showErrorMessage(error.message);
    } finally {
        hideLoadingScreen();
    }
}

async function fetchPokemonData(obj) {
    const response = await fetch(`${API_URL}${obj}`);
    if (!response.ok) throw new Error('Pokémon not found');
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
    const btn = document.getElementById('load-more');
    if (btn) btn.disabled = disabled;
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

async function loadPokemonDetails(list) {
    try {
        const promises = list.map(p => {
            return fetch(p.url)
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to load ${p.name}`);
                    return res.json();
                });
        });
        const data = await Promise.all(promises);
        data.forEach(p => renderPokemon(p));
    } catch (error) {
        showErrorMessage("Failed to load Pokémon details");
    }
}

async function fetchPokemonDetails(id) {
    try {
        const res = await fetch(`${API_URL}${id}`);
        if (!res.ok) throw new Error('Pokémon not found');
        return await res.json();
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        throw error;
    }
}

async function fetchAllPokemonNames() {
    try {
        const count = await fetchPokemonCount();
        await fetchAndProcessAllNames(count);
    } catch (error) {
        console.error('Error fetching Pokémon names:', error);
    }
}

async function fetchPokemonCount() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch Pokémon count');
    const data = await res.json();
    return data.count;
}

async function fetchAndProcessAllNames(count) {
    const res = await fetch(`${API_URL}?limit=${count}`);
    if (!res.ok) throw new Error('Failed to load Pokémon names');
    const data = await res.json();
    allPokemonNames = data.results.map(p => ({
        name: formatPokemonName(p.name),
        id: extractPokemonId(p.url)
    }));
}

function extractPokemonId(url) {
    const parts = url.split('/');
    return parts[parts.length - 2];
}