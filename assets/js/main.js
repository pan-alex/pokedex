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
          updateDom()
          console.log(`error ${err}`)
        });
  }


function updateDom(data) {

  if (data && data.name) {
    // Update images
    +data.id <= 718 ? pokeImage.src = `images/model/${data.id}.png` : pokeImage.src = `images/model/0.png` //718 is the last Sprite that I have

    pokeType1Image.src = `images/type-icons/${data.types[0].type.name}.webp`
    if (data.types[1]?.type.name) {
      pokeType2Image.src = `images/type-icons/${data.types[1].type.name}.webp`
    } else {
      pokeType2Image.src = ''
    }


    // Update info
    query.value = ''
    pokeName.innerText = toCapitalCase(data.name)
    pokeId.innerText = `# ${('000'+data.id).slice(-4)}`


    return true
  } else {
    // Erase image
    pokeImage.src = `images/model/0.png`

    // Display error text
    pokeName.innerText = 'ERR UNKNOWN POKEMON'
    pokeId.innerText = `# 0000`
    return false
  }

}


function toCapitalCase(word) {
    if (word) {
    return word.replace('-', ' ')
               .replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()))
    }
  }