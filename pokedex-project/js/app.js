document.addEventListener('DOMContentLoaded', function() {
    initPokedex();
});


function initPokedex() {
    // Fetch all Pokémon names for autocomplete
    fetchAllPokemonNames();
    
    // Load initial set of Pokémon
    loadInitialPokemon();
    
    // Set up search functionality
    setupSearch();
    
    // Set up overlay event listeners
    setupOverlay();
}

function setupSearch() {
    const searchInput = document.getElementById('search-bar');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (searchInput) {
        // Load all Pokémon names when page loads
        fetchAllPokemonNames();
        
        // Listen for input changes to show suggestions
        searchInput.addEventListener('input', function() {
            const searchText = this.value.trim().toLowerCase();
            
            // Clear suggestions
            suggestionsContainer.innerHTML = '';
            
            if (searchText.length < 1) {
                suggestionsContainer.classList.remove('active');
                return;
            }
            
            // Filter Pokémon names - CHANGED THIS LINE TO USE startsWith()
            const matchingPokemon = allPokemonNames.filter(pokemon => 
                pokemon.name.toLowerCase().startsWith(searchText)
            );
            
            // Display up to 10 suggestions
            const suggestionsToShow = matchingPokemon.slice(0, 10);
            
            if (suggestionsToShow.length > 0) {
                suggestionsToShow.forEach(pokemon => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.textContent = pokemon.name;
                    
                    // When a suggestion is clicked
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
        
        // Close suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target !== searchInput && e.target !== suggestionsContainer) {
                suggestionsContainer.classList.remove('active');
            }
        });
        
        // Handle Enter key
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
        
        // Check if the search term is a name or ID
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
