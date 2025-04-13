function renderPokemon(pokemonData, replace = false) {
    const pokemonContainer = document.getElementById('pokemon-container');
    if (!pokemonContainer) {
        return;
    }
    
    const htmlString = createPokemonCardHTML(pokemonData);
    
    if (replace || pokemonContainer.innerHTML.trim() === '') {
        pokemonContainer.innerHTML = htmlString;
    } else {
        pokemonContainer.innerHTML += htmlString;
    }
    
    attachCardClickHandlers();
}


function attachCardClickHandlers() {
    const cards = document.getElementsByClassName('pokemon-card');
    
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const pokemonId = card.getAttribute('data-id');
        
        card.onclick = null;
        
        card.onclick = function() {
            openDetailView(pokemonId);
        };
    }
}


function createPokemonCardHTML(pokemon) {
    const mainType = pokemon.types[0].type.name;
    const backgroundColor = getTypeColor(mainType);
    
   
    let typesHtml = '';
    for (let i = 0; i < pokemon.types.length; i++) {
        const type = pokemon.types[i].type.name;
        typesHtml += `<span class="type ${type}">${type}</span>`;
    }
    
   
    const pokemonId = pokemon.id.toString().padStart(3, '0');
    const pokemonName = formatPokemonName(pokemon.name);
    const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    
    return `
        <div class="pokemon-card" data-id="${pokemon.id}" style="background-color: ${backgroundColor}">
            <div class="pokemon-id">#${pokemonId}</div>
            <div class="pokemon-name">${pokemonName}</div>
            <div class="pokemon-types">
                ${typesHtml}
            </div>
            <img class="pokemon-image" src="${imageUrl}" alt="${pokemon.name}">
        </div>
    `;
}

async function openDetailView(pokemonId) {
    try {
        showLoadingScreen();
        
       
        const pokemon = await fetchPokemonDetails(pokemonId);
        
     
        const overlay = document.getElementById('pokemon-overlay');
        if (!overlay) {
            hideLoadingScreen();
            return;
        }
                
      
        const titleElements = overlay.getElementsByClassName('overlay-title');
        for (let i = 0; i < titleElements.length; i++) {
            titleElements[i].textContent = `${formatPokemonName(pokemon.name)} #${pokemon.id.toString().padStart(3, '0')}`;
        }
        
        
        const imageElements = overlay.getElementsByClassName('overlay-image');
        for (let i = 0; i < imageElements.length; i++) {
            imageElements[i].src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
            imageElements[i].alt = pokemon.name;
        }
        
      
        const detailsElements = overlay.getElementsByClassName('overlay-details');
        for (let i = 0; i < detailsElements.length; i++) {
          
            let statsHtml = '<div class="stats"><h3>Base Stats</h3>';
            
          
            for (let j = 0; j < pokemon.stats.length; j++) {
                const stat = pokemon.stats[j];
                const statName = formatStatName(stat.stat.name);
                const statValue = stat.base_stat;
                const fillWidth = Math.min(100, statValue);
                
                statsHtml += `
                    <div class="stat-row">
                        <span>${statName}</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${fillWidth}%"></div>
                        </div>
                        <span>${statValue}</span>
                    </div>
                `;
            }
            statsHtml += '</div>';
            
            
            let abilitiesText = '';
            for (let j = 0; j < pokemon.abilities.length; j++) {
                abilitiesText += formatPokemonName(pokemon.abilities[j].ability.name);
                if (j < pokemon.abilities.length - 1) {
                    abilitiesText += ', ';
                }
            }
            
         
            const detailsHtml = `
                <div class="details-section">
                    <h3>Details</h3>
                    <p>Height: ${pokemon.height / 10} m</p>
                    <p>Weight: ${pokemon.weight / 10} kg</p>
                    <p>Abilities: ${abilitiesText}</p>
                </div>
            `;
            
          
            detailsElements[i].innerHTML = statsHtml + detailsHtml;
        }
        
      
        const prevButton = document.getElementById('prev-pokemon');
        if (prevButton) {
            prevButton.setAttribute('data-id', pokemon.id > 1 ? pokemon.id - 1 : 1);
        }
        
        const nextButton = document.getElementById('next-pokemon');
        if (nextButton) {
            nextButton.setAttribute('data-id', pokemon.id + 1);
        }
        
      
        overlay.className = "overlay"; 
        
        hideLoadingScreen();
    } catch (error) {
        console.error('Error in openDetailView:', error);
        hideLoadingScreen();
        showErrorMessage('Failed to load Pokémon details');
    }
}


function hideDetailView() {
    const overlay = document.getElementById('pokemon-overlay');
    if (overlay) {
        overlay.className = "overlay hidden";
    } else {
        return;
    }
}


function navigatePokemon(direction) {
    const buttonId = direction + '-pokemon';
    const button = document.getElementById(buttonId);
    
    if (button) {
        const pokemonId = button.getAttribute('data-id');
        
     
        hideDetailView();
        openDetailView(pokemonId);
    } else {
        return;
    }
}