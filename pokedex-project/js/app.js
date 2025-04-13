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
    
    if (searchInput) {
        fetchAllPokemonNames();
        
        searchInput.addEventListener('input', function() {
            const searchText = this.value.trim().toLowerCase();
            
            suggestionsContainer.innerHTML = '';
            
            if (searchText.length < 1) {
                suggestionsContainer.classList.remove('active');
                return;
            }
            
            const matchingPokemon = allPokemonNames.filter(pokemon => 
                pokemon.name.toLowerCase().startsWith(searchText)
            );
            
            const suggestionsToShow = matchingPokemon.slice(0, 10);
            
            if (suggestionsToShow.length > 0) {
                suggestionsToShow.forEach(pokemon => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.textContent = pokemon.name;
                    
                    suggestionItem.addEventListener('click', function() {
                        searchInput.value = pokemon.name;
                        suggestionsContainer.classList.remove('active');
                        getData(pokemon.id);
                    });
                    
                    suggestionsContainer.appendChild(suggestionItem);
                });
                
                suggestionsContainer.classList.add('active');
            } else {
                suggestionsContainer.classList.remove('active');
            }
        });
        
        document.addEventListener('click', function(e) {
            if (e.target !== searchInput && e.target !== suggestionsContainer) {
                suggestionsContainer.classList.remove('active');
            }
        });
        
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                suggestionsContainer.classList.remove('active');
                searchWithExistingBar();
            }
        });
    }
}

function searchWithExistingBar() {
    const searchInput = document.getElementById('search-bar');
    const searchTerm = searchInput.value.trim().toLowerCase();
    const pokemonContainer = document.getElementById('pokemon-container');
    
    if (searchTerm.length != 0) {
        pokemonContainer.innerHTML = '';
        
        currentOffset = 0;
        
        const matchingPokemon = allPokemonNames.find(pokemon => 
            pokemon.name.toLowerCase() === searchTerm
        );
        
        if (matchingPokemon) {
            getData(matchingPokemon.id);
        } else {
            getData(searchTerm);
        }
    }
}

function setupOverlay() {
    const overlay = document.getElementById('pokemon-overlay');
    
    if (overlay) {
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                hideDetailView();
            }
        });
    } 
}
