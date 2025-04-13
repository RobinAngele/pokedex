function renderPokemon(pokemonData, replace = false) {
    const pokemonContainer = document.getElementById('pokemon-container');
    if (!pokemonContainer) return;
    
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
    const typesHtml = createTypesHTML(pokemon.types);
    const pokemonId = pokemon.id.toString().padStart(3, '0');
    const pokemonName = formatPokemonName(pokemon.name);
    const imageUrl = getPokemonImageUrl(pokemon);
    
    return `
        <div class="pokemon-card" data-id="${pokemon.id}" style="background-color: ${backgroundColor}">
            <div class="pokemon-id">#${pokemonId}</div>
            <div class="pokemon-name">${pokemonName}</div>
            <div class="pokemon-types">${typesHtml}</div>
            <img class="pokemon-image" src="${imageUrl}" alt="${pokemon.name}">
        </div>
    `;
}

function createTypesHTML(types) {
    let typesHtml = '';
    for (let i = 0; i < types.length; i++) {
        const type = types[i].type.name;
        typesHtml += `<span class="type ${type}">${type}</span>`;
    }
    return typesHtml;
}

function getPokemonImageUrl(pokemon) {
    return pokemon.sprites.other['official-artwork'].front_default || 
           pokemon.sprites.front_default;
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
        
        updateOverlayTitle(overlay, pokemon);
        updateOverlayImage(overlay, pokemon);
        updateOverlayDetails(overlay, pokemon);
        setupNavigationButtons(pokemon);
        
        overlay.className = "overlay";
        hideLoadingScreen();
    } catch (error) {
        console.error('Error in openDetailView:', error);
        hideLoadingScreen();
        showErrorMessage('Failed to load Pokémon details');
    }
}

function updateOverlayTitle(overlay, pokemon) {
    const titleElements = overlay.getElementsByClassName('overlay-title');
    const formattedTitle = `${formatPokemonName(pokemon.name)} #${pokemon.id.toString().padStart(3, '0')}`;
    
    for (let i = 0; i < titleElements.length; i++) {
        titleElements[i].textContent = formattedTitle;
    }
}

function updateOverlayImage(overlay, pokemon) {
    const imageElements = overlay.getElementsByClassName('overlay-image');
    const imageUrl = getPokemonImageUrl(pokemon);
    
    for (let i = 0; i < imageElements.length; i++) {
        imageElements[i].src = imageUrl;
        imageElements[i].alt = pokemon.name;
    }
}

function updateOverlayDetails(overlay, pokemon) {
    const detailsElements = overlay.getElementsByClassName('overlay-details');
    
    for (let i = 0; i < detailsElements.length; i++) {
        const statsHtml = createStatsHTML(pokemon.stats);
        const abilitiesText = createAbilitiesText(pokemon.abilities);
        const detailsHtml = createDetailsHTML(pokemon, abilitiesText);
        
        detailsElements[i].innerHTML = statsHtml + detailsHtml;
    }
}

function createStatsHTML(stats) {
    let statsHtml = '<div class="stats"><h3>Base Stats</h3>';
    
    for (let j = 0; j < stats.length; j++) {
        const stat = stats[j];
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
    
    return statsHtml + '</div>';
}

function createAbilitiesText(abilities) {
    let abilitiesText = '';
    
    for (let j = 0; j < abilities.length; j++) {
        abilitiesText += formatPokemonName(abilities[j].ability.name);
        if (j < abilities.length - 1) {
            abilitiesText += ', ';
        }
    }
    
    return abilitiesText;
}

function createDetailsHTML(pokemon, abilitiesText) {
    return `
        <div class="details-section">
            <h3>Details</h3>
            <p>Height: ${pokemon.height / 10} m</p>
            <p>Weight: ${pokemon.weight / 10} kg</p>
            <p>Abilities: ${abilitiesText}</p>
        </div>
    `;
}

function setupNavigationButtons(pokemon) {
    const prevButton = document.getElementById('prev-pokemon');
    if (prevButton) {
        prevButton.setAttribute('data-id', pokemon.id > 1 ? pokemon.id - 1 : 1);
    }
    
    const nextButton = document.getElementById('next-pokemon');
    if (nextButton) {
        nextButton.setAttribute('data-id', pokemon.id + 1);
    }
}

function hideDetailView() {
    const overlay = document.getElementById('pokemon-overlay');
    if (overlay) {
        overlay.className = "overlay hidden";
    }
}

function navigatePokemon(direction) {
    const buttonId = direction + '-pokemon';
    const button = document.getElementById(buttonId);
    
    if (button) {
        const pokemonId = button.getAttribute('data-id');
        hideDetailView();
        openDetailView(pokemonId);
    }
}