function renderPokemon(pokemonData, replace = false) {
    const container = document.getElementById('pokemon-container');
    if (!container) return;
    const html = createPokemonCardHTML(pokemonData);
    if (replace || container.innerHTML.trim() === '') {
        container.innerHTML = html;
    } else {
        container.innerHTML += html;
    }
    attachCardClickHandlers();
    setTimeout(checkCardCountAndToggleButtons, 100);
}

function attachCardClickHandlers() {
    const cards = document.getElementsByClassName('pokemon-card');
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const id = card.getAttribute('data-id');
        card.onclick = null;
        card.onclick = function() {
            openDetailView(id);
        };
    }
}

function createPokemonCardHTML(pokemon) {
    const mainType = pokemon.types[0].type.name;
    const bgColor = getTypeColor(mainType);
    const typesHtml = createTypesHTML(pokemon.types);
    const id = pokemon.id.toString().padStart(3, '0');
    const name = formatPokemonName(pokemon.name);
    const img = getPokemonImageUrl(pokemon);
    return createPokemonCardHTMLtemplate(pokemon, bgColor, id, name, typesHtml, img);
}

function createTypesHTML(types) {
    let html = '';
    for (let i = 0; i < types.length; i++) {
        const type = types[i].type.name;
        html += createTypesHTMLtemplate(type);
    }
    return html;
}

function getPokemonImageUrl(pokemon) {
    return pokemon.sprites.other['official-artwork'].front_default || 
           pokemon.sprites.front_default;
}

async function openDetailView(id) {
    try {
        showLoadingScreen();
        const pokemon = await fetchPokemonDetails(id);
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
    const titles = overlay.getElementsByClassName('overlay-title');
    const title = `${formatPokemonName(pokemon.name)} #${pokemon.id.toString().padStart(3, '0')}`;
    for (let i = 0; i < titles.length; i++) {
        titles[i].textContent = title;
    }
}

function updateOverlayImage(overlay, pokemon) {
    const images = overlay.getElementsByClassName('overlay-image');
    const src = getPokemonImageUrl(pokemon);
    for (let i = 0; i < images.length; i++) {
        images[i].src = src;
        images[i].alt = pokemon.name;
    }
}

function updateOverlayDetails(overlay, pokemon) {
    const details = overlay.getElementsByClassName('overlay-details');
    for (let i = 0; i < details.length; i++) {
        const statsHtml = createStatsHTML(pokemon.stats);
        const abilitiesText = createAbilitiesText(pokemon.abilities);
        const detailsHtml = createDetailsHTML(pokemon, abilitiesText);
        details[i].innerHTML = statsHtml + detailsHtml;
    }
}

function createStatsHTML(stats) {
    let statsRows = '';
    for (let j = 0; j < stats.length; j++) {
        const stat = stats[j];
        const name = formatStatName(stat.stat.name);
        const value = stat.base_stat;
        const width = Math.min(100, value);
        statsRows += createStatRowHTMLtemplate(name, value, width);
    }
    return createStatsHTMLtemplate(statsRows);
}

function createAbilitiesText(abilities) {
    let text = '';
    for (let j = 0; j < abilities.length; j++) {
        text += formatPokemonName(abilities[j].ability.name);
        if (j < abilities.length - 1) {
            text += ', ';
        }
    }
    return text;
}

function createDetailsHTML(pokemon, abilitiesText) {
    return createDetailsHTMLtemplate(
        pokemon.height / 10,
        pokemon.weight / 10,
        abilitiesText
    );
}

function setupNavigationButtons(pokemon) {
    const prevBtn = document.getElementById('prev-pokemon');
    if (prevBtn) {
        prevBtn.setAttribute('data-id', pokemon.id > 1 ? pokemon.id - 1 : 1);
        if (pokemon.id <= 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = '';
        }
    }
    const nextBtn = document.getElementById('next-pokemon');
    if (nextBtn) {
        nextBtn.setAttribute('data-id', pokemon.id + 1);
    }
}

function hideDetailView() {
    const overlay = document.getElementById('pokemon-overlay');
    if (overlay) {
        overlay.className = "overlay hidden";
    }
}

function navigatePokemon(direction) {
    const btn = document.getElementById(direction + '-pokemon');
    if (btn) {
        const id = btn.getAttribute('data-id');
        hideDetailView();
        openDetailView(id);
    }
}