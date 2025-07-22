function createPokemonCardHTMLtemplate(pokemon, bgColor, id, name, typesHtml, img) {
    return `
        <div class="pokemon-card" data-id="${pokemon.id}" style="background-color: ${bgColor}">
            <div class="pokemon-id">#${id}</div>
            <div class="pokemon-name">${name}</div>
            <div class="pokemon-types">${typesHtml}</div>
            <img class="pokemon-image" src="${img}" alt="${pokemon.name}">
        </div>
    `;
}

function createTypesHTMLtemplate(type) {
    return `<span class="type ${type}">${type}</span>`;
}

function createStatRowHTMLtemplate(name, value, width) {
    return `
        <div class="stat-row">
            <span>${name}</span>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${width}%"></div>
            </div>
            <span>${value}</span>
        </div>
    `;
}

function createStatsHTMLtemplate(statsRows) {
    return `<div class="stats"><h3>Base Stats</h3>${statsRows}</div>`;
}

function createDetailsHTMLtemplate(height, weight, abilitiesText) {
    return `
        <div class="details-section">
            <h3>Details</h3>
            <p>Height: ${height} m</p>
            <p>Weight: ${weight} kg</p>
            <p>Abilities: ${abilitiesText}</p>
        </div>
    `;
}