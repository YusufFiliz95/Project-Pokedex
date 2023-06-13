async function init() {
    await includeHTML();
    loadPokedex();
    showMyPokedex();
    loadingDot();
}

//FUNCTION FOR INCLUDING OTHER HTML SNIPPETS
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/** API LINK FOR RESEARCH
 * https://pokeapi.co/api/v2/pokemon/ditto
 */

let currentPokemon;
let firstPokemon = 1;
let lastPokemon = 31;
let type = 0;
let secondType = 1;

/**
 * It loops through the firstPokemon and lastPokemon variables, and for each iteration, it fetches the
 * data from the API, and then renders the data to the page.
 */
async function loadPokedex() {
    for (let i = firstPokemon; i <= lastPokemon; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        console.log('Loaded pokemon', currentPokemon);
        renderPokemons();
    }
}

/**
 * It fetches the next 31 pokemons from the API and renders them to the page.
 */
async function loadMorePokemons() {
    firstPokemon += 31;
    lastPokemon += 31;
    if (lastPokemon > 151) {
        lastPokemon = 151;
    }
    for (let i = firstPokemon; i <= lastPokemon; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        console.log('Loaded pokemon', currentPokemon);
        renderPokemons();
    }
}


/**
 * It renders the current pokemon's name, image, and types.
 */
function renderPokemons() {
    document.getElementById('allpokemons').innerHTML += /*html*/`
<div class="current-pokemon border-step3 framed primary exclude-border" onclick="showCurrentPokemon(event)" data-pokemon-id="${currentPokemon['id']}">
    <img src="img/type-${currentPokemon['types'][0]['type']['name']}.svg" class="background-${currentPokemon['types'][0]['type']['name']}" alt="">
        <div class="current-pokemon-name">
            <div class="center arrow-width">
                <div class="arrow"></div>
            </div>
            <div class="center pokemon-name">
            ${currentPokemon['name']}
            </div>
        </div>
        <div class="current-pokemon-image"><img src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}" class="current-pokemon-image"></div>
        <div class="current-pokemon-type"></div>
    `;
    document.getElementById('eightbitpokemon').innerHTML += /*html*/`
        <img class="current-eight-bit-pokemon" src="${currentPokemon['sprites']['versions']['generation-v']['black-white']['front_default']}">
    `;
    renderPokemonTypes();
}

/**
 * It gets the last pokemon type element, then loops through the current pokemon's types and adds them
 * to the last pokemon type element.
 */
function renderPokemonTypes() {
    let currentPokemonTypes = document.getElementsByClassName('current-pokemon-type', 'current-responsive-pokemon-types');
    let lastPokemonType = currentPokemonTypes[currentPokemonTypes.length - 1];

    let types = '';
    for (let j = 0; j < currentPokemon['types'].length; j++) {
        let type = currentPokemon['types'][j]['type']['name'];
        types += `<span class="type-${type} border-step3 types">${type}</span> `;
    }
    lastPokemonType.innerHTML = types;
}



/**
 * It takes the pokemon id from the clicked pokemon and uses it to fetch the pokemon's data from the
 * API. Then it displays the pokemon's name, image, and types.
 * @param event - The event object
 */
async function showCurrentPokemon(event) {
    let target = event.currentTarget;
    let pokemonId = target.getAttribute("data-pokemon-id");
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    showCurrentPokemonInfo();
    showCurrentResponsivePokemonInfo();
    if (currentPokemon['types'].length === 2) {
        document.getElementById('type1').innerHTML = `${currentPokemon['types'][0]['type']['name']}`;
        document.getElementById('type2').innerHTML = `${currentPokemon['types'][1]['type']['name']}`;
        document.getElementById('currentresponsivetype1').innerHTML = `${currentPokemon['types'][0]['type']['name']}`;
        document.getElementById('currentresponsivetype2').innerHTML = `${currentPokemon['types'][1]['type']['name']}`;
    } else {
        document.getElementById('type1').innerHTML = `${currentPokemon['types'][0]['type']['name']}`;
        document.getElementById('currentresponsivetype1').innerHTML = `${currentPokemon['types'][0]['type']['name']}`;
        document.getElementById('currentresponsivetype2').classList.add('d-none');
    }
    document.getElementById('name-screen').innerHTML = /*html*/`${currentPokemon['name']}`;
}

/**
 * It fetches the next pokemon's data from the API and displays it on the screen.
 * @returns the value of the variable currentPokemon.
 */
async function nextPokemon() {
    if (currentPokemon['id'] === 151) {
        return;
    }
    let nextId = currentPokemon['id'] + 1;
    let url = `https://pokeapi.co/api/v2/pokemon/${nextId}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    navigateThroughtPokemons();
    if (currentPokemon['types'].length === 2) {
        document.getElementById('type1').innerHTML = `${currentPokemon['types'][0]['type']['name']}`;
        document.getElementById('type2').innerHTML = `${currentPokemon['types'][1]['type']['name']}`;
        document.getElementById('currentresponsivetype1').innerHTML = `${currentPokemon['types'][0]['type']['name']}`;
        document.getElementById('currentresponsivetype2').innerHTML = `${currentPokemon['types'][1]['type']['name']}`;
    } else {
        document.getElementById('type1').innerHTML = `${currentPokemon['types'][0]['type']['name']}`;
        document.getElementById('currentresponsivetype1').innerHTML = `${currentPokemon['types'][0]['type']['name']}`;
        document.getElementById('currentresponsivetype2').classList.add('d-none');
    }
    document.getElementById('name-screen').innerHTML = /*html*/`${currentPokemon['name']}`;
}

/**
 * It fetches the previous pokemon's data from the API and displays it on the screen.
 */
async function previousPokemon() {
    let nextId = currentPokemon['id'] - 1;
    let url = `https://pokeapi.co/api/v2/pokemon/${nextId}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    navigateThroughtPokemons();
    if (currentPokemon['types'].length === 2) {
        document.getElementById('type1').innerHTML = `${currentPokemon['types'][0]['type']['name']}`;
        document.getElementById('type2').innerHTML = `${currentPokemon['types'][1]['type']['name']}`;
        document.getElementById('currentresponsivetype1').innerHTML = `${currentPokemon['types'][0]['type']['name']}`;
        document.getElementById('currentresponsivetype2').innerHTML = `${currentPokemon['types'][1]['type']['name']}`;
    } else {
        document.getElementById('type1').innerHTML = `${currentPokemon['types'][0]['type']['name']}`;
        document.getElementById('currentresponsivetype1').innerHTML = `${currentPokemon['types'][0]['type']['name']}`;
        document.getElementById('currentresponsivetype2').classList.add('d-none');
    }
    document.getElementById('name-screen').innerHTML = /*html*/`${currentPokemon['name']}`;
}

/**
 * It removes the class 'd-none' from the element with the id 'allpokemons', adds the class 'd-none' to
 * the element with the id 'closebtn', adds the class 'd-none' to the element with the id 'pokedex',
 * adds the class 'd-none' to the element with the id 'eightbitpokemon', and removes the class 'd-none'
 * from the element with the id 'searchinput'.
 */
function showAllPokemons() {
    document.getElementById('allpokemons').classList.remove('d-none');
    document.getElementById('closebtn').classList.add('d-none');
    document.getElementById('pokedex').classList.add('d-none');
    document.getElementById('eightbitpokemon').classList.add('d-none');
    document.getElementById('searchinput').classList.remove('d-none');
    document.getElementById('loadmorebtn').classList.remove('d-none');
}

/**
 * It's a function that changes the innerHTML of some elements in the HTML file.
 */
function navigateThroughtPokemons() {
    document.getElementById('currentpokemonheight').innerHTML = /*html*/ `${currentPokemon['height'] * 10}cm`;
    document.getElementById('main-screen').innerHTML = /*html*/`<img class="show-current-pokemon" src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}" alt="">`;
    document.getElementById('eightbitpokemon').innerHTML = /*html*/`<img class="current-eight-bit-pokemon" src="${currentPokemon['sprites']['versions']['generation-v']['black-white']['front_default']}" alt="">`;
    document.getElementById('currentpokemonability').innerHTML = /*html*/`${currentPokemon['abilities'][0]['ability']['name']}`;
    document.getElementById('id-screen').innerHTML = /*html*/ `#${currentPokemon['id']}`;
    document.getElementById('currentresponsivepokemonsection').classList.remove('d-none');
    document.getElementById('currentresponsivepokemonname').innerHTML = /*html*/`${currentPokemon['name']}`;
    document.getElementById('currentresponsivepokemonimg').innerHTML = /*html*/`<img class="current-responsive-pokemon-img" src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}" alt="">`;
    document.getElementById('currentresponsivepokemonability').innerHTML = /*html*/`${currentPokemon['abilities'][0]['ability']['name']}`;
    document.getElementById('currentresponsivepokemonheight').innerHTML = /*html*/ `${currentPokemon['height'] * 10}cm`;
    document.getElementById('currentresponsiveid').innerHTML = /*html*/ `#${currentPokemon['id']}`;
}


/**
 * It shows the current pokemon's info.
 */
function showCurrentPokemonInfo() {
    document.getElementById('allpokemons').classList.add('d-none');
    document.getElementById('searchinput').classList.add('d-none');
    document.getElementById('loadmorebtn').classList.add('d-none');
    document.getElementById('closebtn').classList.remove('d-none');
    document.getElementById('pokedex').classList.remove('d-none');
    document.getElementById('eightbitpokemon').classList.remove('d-none');
    document.getElementById('currentpokemonability').innerHTML = /*html*/`${currentPokemon['abilities'][0]['ability']['name']}`;
    document.getElementById('currentpokemonheight').innerHTML = /*html*/ `${currentPokemon['height'] * 10}cm`;
    document.getElementById('main-screen').innerHTML = /*html*/`<img class="show-current-pokemon" src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}" alt="">`;
    document.getElementById('eightbitpokemon').innerHTML = /*html*/`<img class="current-eight-bit-pokemon" src="${currentPokemon['sprites']['versions']['generation-v']['black-white']['front_default']}" alt="">`;
    document.getElementById('id-screen').innerHTML = /*html*/ `#${currentPokemon['id']}`;
}

/**
 * It takes the value of the input field, and then it loops through all the pokemon cards and checks if
 * the name of the pokemon is included in the input value. If it is, it removes the class 'd-none' from
 * the card, if it isn't, it adds the class 'd-none' to the card.
 */
async function searchPokemon() {
    let input = document.querySelector('input[type="text"]').value;
    let allPokemons = document.querySelectorAll('.current-pokemon');
    for (let i = 0; i < allPokemons.length; i++) {
        let pokemon = allPokemons[i];
        let pokemonName = pokemon.querySelector('.pokemon-name').textContent;
        if (!pokemonName.toLowerCase().includes(input.toLowerCase())) {
            pokemon.classList.add('d-none');
        } else {
            pokemon.classList.remove('d-none');
        }
    }
}

/**
 * It shows the current responsive pokemon info.
 */
function showCurrentResponsivePokemonInfo() {
    document.getElementById('loadmorebtn').classList.add('d-none');
    document.getElementById('currentresponsivepokemonsection').classList.remove('d-none');
    document.getElementById('currentresponsivepokemonname').innerHTML = /*html*/`${currentPokemon['name']}`;
    document.getElementById('currentresponsivepokemonimg').innerHTML = /*html*/`<img class="current-responsive-pokemon-img" src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}" alt="">`;
    document.getElementById('currentresponsivepokemonability').innerHTML = /*html*/`${currentPokemon['abilities'][0]['ability']['name']}`;
    document.getElementById('currentresponsivepokemonheight').innerHTML = /*html*/ `${currentPokemon['height'] * 10}cm`;
    document.getElementById('currentresponsiveid').innerHTML = /*html*/ `#${currentPokemon['id']}`;
}


/**
 * After 7 seconds, remove the class 'd-none' from the element with the id 'allpokemons' and the
 * element with the id 'header', and add the class 'd-none' to the element with the id 'loadingscreen'.
 */
function showMyPokedex() {
    setTimeout(function () {
        document.getElementById('allpokemons').classList.remove('d-none');
        document.getElementById('header').classList.remove('d-none');
        document.getElementById('loadingscreen').classList.add('d-none');
        document.getElementById('loadmorebtn').classList.remove('d-none');
    }, 6000);
}

/**
 * Function for loading animation.
 */
function loadingDot() {
    let dot2 = document.getElementById("dot3");

    setInterval(function () {
        if (dot2.style.visibility === "hidden") {
            dot2.style.visibility = "visible";
        } else {
            dot2.style.visibility = "hidden";
        }
    }, 500);
}

