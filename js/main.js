document.querySelector('#submitQuery').addEventListener('click', fetchPokemonData)
document.querySelector('#clearQuery').addEventListener('click', function() {query.value = ''})


function fetchPokemonData(){
    console.log('Hi')
    const choice = query.value.toLowerCase()
    const url = 'https://pokeapi.co/api/v2/pokemon/'+choice

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data)
          pokeName.innerText = toCapitalCase(data.name)
          pokeId.innerText = `ID: ${data.id}`
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
  }


function toCapitalCase(word) {
    if (word) {
    return word.replace('-', ' ')
               .replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()))
    }
  }