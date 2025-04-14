document.addEventListener('DOMContentLoaded', () => initPokedex());

function initPokedex() {
    fetchAllPokemonNames();
    loadInitialPokemon();
    setupSearch();
    setupOverlay();
}

function setupSearch() {
    const searchInput = document.getElementById('search-bar');
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!searchInput) return;
    setupSearchInput(searchInput, suggestionsContainer);
    setupDocumentClickHandler(searchInput, suggestionsContainer);
    setupEnterKeyHandler(searchInput, suggestionsContainer);
}

function setupSearchInput(input, container) {
    input.addEventListener('input', function() {
        handleSearchInputChange(this.value.trim().toLowerCase(), container);
    });
}

function handleSearchInputChange(text, container) {
    container.innerHTML = '';
    if (text.length < 1) {
        container.classList.remove('active');
        return;
    }
    const matches = findMatchingPokemon(text);
    displaySuggestions(matches, container);
}

function findMatchingPokemon(text) {
    return allPokemonNames.filter(p => p.name.toLowerCase().startsWith(text)).slice(0, 10);
}

function displaySuggestions(list, container) {
    if (list.length > 0) {
        list.forEach(p => createSuggestionItem(p, container));
        container.classList.add('active');
    } else {
        container.classList.remove('active');
    }
}

function createSuggestionItem(pokemon, container) {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.textContent = pokemon.name;
    attachSuggestionClickHandler(item, pokemon);
    container.appendChild(item);
}

function attachSuggestionClickHandler(item, pokemon) {
    item.addEventListener('click', () => selectSuggestion(pokemon));
}

function selectSuggestion(pokemon) {
    const input = document.getElementById('search-bar');
    const container = document.getElementById('search-suggestions');
    input.value = pokemon.name;
    container.classList.remove('active');
    getData(pokemon.id);
}

function setupDocumentClickHandler(input, container) {
    document.addEventListener('click', e => {
        if (e.target !== input && e.target !== container) {
            container.classList.remove('active');
        }
    });
}

function setupEnterKeyHandler(input, container) {
    input.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
            container.classList.remove('active');
            searchWithExistingBar();
        }
    });
}

function searchWithExistingBar() {
    const input = document.getElementById('search-bar');
    const term = input.value.trim().toLowerCase();
    if (term.length === 0) return;
    resetSearchState();
    performSearch(term);
}

function resetSearchState() {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = '';
    currentOffset = 0;
}

function performSearch(term) {
    const match = allPokemonNames.find(p => p.name.toLowerCase() === term);
    if (match) {
        getData(match.id);
    } else {
        getData(term);
    }
}

function setupOverlay() {
    const overlay = document.getElementById('pokemon-overlay');
    if (overlay) {
        attachOverlayClickHandler(overlay);
    }
}

function attachOverlayClickHandler(overlay) {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) hideDetailView();
    });
}

function checkCardCountAndToggleButtons() {
    const cards = document.querySelectorAll('.pokemon-card');
    const loadMore = document.getElementById('load-more');
    const back = document.getElementById('back-button');
    if (!loadMore || !back) return;
    if (cards.length === 1) {
        loadMore.classList.add('hidden');
        back.classList.remove('hidden');
    } else {
        loadMore.classList.remove('hidden');
        back.classList.add('hidden');
    }
}

function resetToInitialView() {
    const container = document.getElementById('pokemon-container');
    const input = document.getElementById('search-bar');
    if (container) container.innerHTML = '';
    if (input) input.value = '';
    currentOffset = 0;
    loadInitialPokemon();
}
