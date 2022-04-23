// On page-load
fetchAllPokemon('https://pokeapi.co/api/v2/pokemon?limit=2000')

document.querySelector('#submitQuery').addEventListener('click', fetchPokemonData)
document.querySelector('#clearQuery').addEventListener('click', function() {query.value = ''})


// Fetch & Display the list of all pokemon. Execute on page-load
function fetchAllPokemon(url) {
  fetch(url)
  .then(res => res.json()) // parse response as JSON
  .then(pokemon => {
    updateDomPokeList(pokemon)
  })
  .catch(err => {
    updateDomInfo()
    console.log(`error ${err}`)
  });
}


function updateDomPokeList(pokemon) {
  // Update evolved-to
  pokeList.replaceChildren();
  pokemon.results.forEach( (mon, id) => {
      li = document.createElement('li')
      li.textContent = `${('000'+id).slice(-4)} ${toCapitalCase(mon.name)}`
      pokeList.appendChild(li)
    })
}


// Fetch pokemon data on event.
function fetchPokemonData(){
    // Fetches pokemon data from pokemon API and updates DOM with information.
    // Evolution data are from the species API and evolution chain APIs. These are wrapped inside
    // this function. The inner functions also update the DOM with the information.

    // Structure:
    // fetchPokemonData()
    //     fetchEvolution()
    //         fetchEvolutionChain() --> updates DOM with evolvesFrom pokemon
    //         checkEvolutionChain() --> updates DOM with evolvesTo pokemon
    //     -> Update DOM with other pokemon info

    const pokemonName = query.value.trim().replace(/ /g, '-').toLowerCase()
    const url = 'https://pokeapi.co/api/v2/pokemon/' + pokemonName

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(pokemonData => {
          fetchEvolution(pokemonData, pokemonName);
          updateDomInfo(pokemonData);
        })
        .catch(err => {
          updateDomInfo()
          console.log(`error ${err}`)
        });
  }


function fetchEvolution(pokemonData, pokemonName){
  fetch(pokemonData.species.url)
      .then(res => res.json()) // parse response as JSON
      .then(speciesData => {
        updateDomEvolvesFrom(speciesData)
        fetchEvolutionChain(speciesData.evolution_chain.url, pokemonName)
      })
      .catch(err => {
        updateDom()
        console.log(`error ${err}`)
      });
}


function fetchEvolutionChain(urlEvolution, pokemonName){
  fetch(urlEvolution)
      .then(res => res.json()) // parse response as JSON
      .then(evolutionData => {
        evolvesTo = checkEvolutionChain(evolutionData, pokemonName) // overwrites global
      });
}


function checkEvolutionChain(evolutionData, pokemonName) {
  let evolvesTo = []
  if(evolutionData.chain.species.name === pokemonName) { // If this is the tier-0 evolution form
    evolutionData.chain.evolves_to.forEach( item => {
      evolvesTo.push(item.species.name)
    })
  } else { // This if-else chain only works where there are 2 evolutions (3 total forms). I don't think there are any pokemon with more than 2 evolutions?
    for (i in evolutionData.chain.evolves_to) {
      if (evolutionData.chain.evolves_to[i].species.name === pokemonName) {
        evolutionData.chain.evolves_to[i].evolves_to.forEach( item => evolvesTo.push(item.species.name))
      }
    }
  }
  updateDomEvolvesTo(evolvesTo)
}


function updateDomEvolvesFrom(speciesData) {
  pokeEvolveFrom.innerText = toCapitalCase(speciesData.evolves_from_species?.name) ?? 'N/A'; //Update Dom within this function
}


function updateDomEvolvesTo(evolvesTo) {
  // Update evolved-to
  pokeEvolveTo.replaceChildren();
  if (evolvesTo[0]) {
    evolvesTo.forEach( evo => {
      li = document.createElement('li')
      li.textContent = toCapitalCase(evo)
      pokeEvolveTo.appendChild(li)
    })
  } else {
    li = document.createElement('li')
    li.textContent = 'N/A'
    pokeEvolveTo.appendChild(li)
  }
}


function updateDomInfo(data) {

  if (data && data.name) { // If valid query (successfully returns and object & that object is a pokemon [with a name])
    // Update images
    +data.id <= 718 ? pokeImage.src = `images/model/${data.id}.png` : pokeImage.src = `images/model/0.png` //718 is the last Sprite that I have

    pokeType1Image.src = `images/type-icons/${data.types[0].type.name}.webp` // Update icons with pokemon type
    if (data.types[1]?.type.name) {
      pokeType2Image.src = `images/type-icons/${data.types[1].type.name}.webp`
    } else {
      pokeType2Image.src = ''
    }

    // Update info
    query.value = '';
    pokeName.innerText = toCapitalCase(data.name);
    pokeId.innerText = `# ${('000'+data.id).slice(-4)}`;
    pokeHeight.innerText = +data.height / 10; //in metres
    pokeWeight.innerText = +data.weight / 10; //in kg

    //Stats
    [pokeStatHp, pokeStatAtk, pokeStatDef, pokeStatSpAtk, pokeStatSpDef, pokeStatSpeed].forEach( (item, i) => {
      item.innerText = fillDots(+data.stats[i].base_stat, ['hp', 'atk', 'def', 'spAtk', 'spDef', 'spd'][i])
    })

    //Evolutions are updated in `checkEvolutionChain` and `fetchEvolutionChain`

    return true

  } else { // If invalid query
    // Erase image
    pokeImage.src = `images/model/0.png`

    // Display error text
    pokeName.innerText = 'ERR UNKNOWN POKEMON'
    pokeId.innerText = `# 0000`
    return false
  }

}


function fillDots(value, stat) {
maxStats = {
  'hp': 255,
  'atk': 180,
  'def': 230,
  'spAtk': 180,
  'spDef': 230,
  'spd': 180,
}
return ('●'.repeat(Math.round(value*10 / maxStats[stat])) + '○○○○○○○○○○').slice(0, 10)
}


function toCapitalCase(word) {
    if (word) {
    return word.replace(/-/g, ' ')
               .replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()))
    }
  }

