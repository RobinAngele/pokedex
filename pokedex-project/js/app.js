
document.addEventListener('DOMContentLoaded', function() {
    initPokedex();
});


function initPokedex() {
    loadInitialPokemon();
    setupSearch();
    setupOverlay();
    
   
}

function setupSearch() {
    const searchInput = document.getElementById('search-bar');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
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
        
        getData(searchTerm);
    } else {
        return;
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
