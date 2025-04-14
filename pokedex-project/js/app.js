document.addEventListener('DOMContentLoaded', function() {
    initPokedex();
});

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

function setupSearchInput(searchInput, suggestionsContainer) {
    searchInput.addEventListener('input', function() {
        const searchText = this.value.trim().toLowerCase();
        handleSearchInputChange(searchText, suggestionsContainer);
    });
}

function handleSearchInputChange(searchText, suggestionsContainer) {
    suggestionsContainer.innerHTML = '';
    
    if (searchText.length < 1) {
        suggestionsContainer.classList.remove('active');
        return;
    }
    
    const matchingPokemon = findMatchingPokemon(searchText);
    displaySuggestions(matchingPokemon, suggestionsContainer);
}

function findMatchingPokemon(searchText) {
    return allPokemonNames.filter(pokemon => 
        pokemon.name.toLowerCase().startsWith(searchText)
    ).slice(0, 10);
}

function displaySuggestions(pokemonList, suggestionsContainer) {
    if (pokemonList.length > 0) {
        pokemonList.forEach(pokemon => {
            createSuggestionItem(pokemon, suggestionsContainer);
        });
        suggestionsContainer.classList.add('active');
    } else {
        suggestionsContainer.classList.remove('active');
    }
}

function createSuggestionItem(pokemon, suggestionsContainer) {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.textContent = pokemon.name;
    
    attachSuggestionClickHandler(suggestionItem, pokemon);
    suggestionsContainer.appendChild(suggestionItem);
}

function attachSuggestionClickHandler(suggestionItem, pokemon) {
    suggestionItem.addEventListener('click', function() {
        selectSuggestion(pokemon);
    });
}

function selectSuggestion(pokemon) {
    const searchInput = document.getElementById('search-bar');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    searchInput.value = pokemon.name;
    suggestionsContainer.classList.remove('active');
    getData(pokemon.id);
}

function setupDocumentClickHandler(searchInput, suggestionsContainer) {
    document.addEventListener('click', function(e) {
        if (e.target !== searchInput && e.target !== suggestionsContainer) {
            suggestionsContainer.classList.remove('active');
        }
    });
}

function setupEnterKeyHandler(searchInput, suggestionsContainer) {
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            suggestionsContainer.classList.remove('active');
            searchWithExistingBar();
        }
    });
}

function searchWithExistingBar() {
    const searchInput = document.getElementById('search-bar');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm.length === 0) return;
    
    resetSearchState();
    performSearch(searchTerm);
}

function resetSearchState() {
    const pokemonContainer = document.getElementById('pokemon-container');
    pokemonContainer.innerHTML = '';
    currentOffset = 0;
}

function performSearch(searchTerm) {
    const matchingPokemon = allPokemonNames.find(pokemon => 
        pokemon.name.toLowerCase() === searchTerm
    );
    
    if (matchingPokemon) {
        getData(matchingPokemon.id);
    } else {
        getData(searchTerm);
    }
}

function setupOverlay() {
    const overlay = document.getElementById('pokemon-overlay');
    
    if (overlay) {
        attachOverlayClickHandler(overlay);
    }
}

function attachOverlayClickHandler(overlay) {
    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            hideDetailView();
        }
    });
}

/**
 * Checks number of cards and toggles appropriate buttons
 */
function checkCardCountAndToggleButtons() {
    const pokemonCards = document.querySelectorAll('.pokemon-card');
    const loadMoreButton = document.getElementById('load-more');
    const backButton = document.getElementById('back-button');
    
    if (!loadMoreButton || !backButton) return;
    
    // If only one card, we're showing a single Pokémon from search
    if (pokemonCards.length === 1) {
        loadMoreButton.classList.add('hidden');
        backButton.classList.remove('hidden');
    } else {
        // Multiple cards, show load more button
        loadMoreButton.classList.remove('hidden');
        backButton.classList.add('hidden');
    }
}

/**
 * Reset view to show all Pokémon
 */
function resetToInitialView() {
    // Clear container and reset search
    const pokemonContainer = document.getElementById('pokemon-container');
    const searchInput = document.getElementById('search-bar');
    
    if (pokemonContainer) pokemonContainer.innerHTML = '';
    if (searchInput) searchInput.value = '';
    
    // Reset offset and load initial Pokémon
    currentOffset = 0;
    loadInitialPokemon();
}
