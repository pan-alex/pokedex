document.querySelector('#submitQuery').addEventListener('click', fetchPokemonData)
document.querySelector('#clearQuery').addEventListener('click', function() {query.value = ''})


function fetchPokemonData(){
    const choice = query.value.trim().toLowerCase()
    const url = 'https://pokeapi.co/api/v2/pokemon/'+choice

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data)
          updateDom(data)
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
  }


function updateDom(data) {
  // Update image
  +data.id <= 718 ? pokeImage.src = `sprites/model/${data.id}.png` : pokeImage.src = `sprites/model/0.png` //718 is the last Sprite that I have

  // Update info
  query.value = ''
  pokeName.innerText = toCapitalCase(data.name)
  pokeId.innerText = `# ${('000'+data.id).slice(-4)}`

  return true
}


function toCapitalCase(word) {
    if (word) {
    return word.replace('-', ' ')
               .replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()))
    }
  }