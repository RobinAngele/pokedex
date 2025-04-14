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

function createStatsHTML(stats) {
    let statsHtml = '<div class="stats"><h3>Base Stats</h3>';
    
    for (let j = 0; j < stats.length; j++) {
        statsHtml += createStatRowHTML(stats[j]);
    }
    
    return statsHtml + '</div>';
}

function createStatRowHTML(stat) {
    const statName = formatStatName(stat.stat.name);
    const statValue = stat.base_stat;
    const fillWidth = Math.min(100, statValue);
    
    return `
        <div class="stat-row">
            <span>${statName}</span>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${fillWidth}%"></div>
            </div>
            <span>${statValue}</span>
        </div>
    `;
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