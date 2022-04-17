document.querySelector('#submitQuery').addEventListener('click', fetchPokemonData)
document.querySelector('#clearQuery').addEventListener('click', function() {query.value = ''})


function fetchPokemonData(){
    const choice = query.value.trim().replace(/ /g, '-').toLowerCase()
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
    query.value = '';
    pokeName.innerText = toCapitalCase(data.name);
    pokeId.innerText = `# ${('000'+data.id).slice(-4)}`;
    pokeHeight.innerText = +data.height / 10; //in metres
    pokeWeight.innerText = +data.weight / 10; //in kg

    [pokeStatHp, pokeStatAtk, pokeStatDef, pokeStatSpAtk, pokeStatSpDef, pokeStatSpeed].forEach( (item, i) => {
      // console.log(i)
      // console.log(data.stats[i].base_stat)
      // console.log(['hp', 'atk', 'def', 'spAtk', 'spDef', 'spd'][i])
      item.innerText = fillDots(+data.stats[i].base_stat, ['hp', 'atk', 'def', 'spAtk', 'spDef', 'spd'][i])
    })
    // pokeStatHp.innerText = fillDots(data.stats[0].base_stat, 'hp')
    // pokeStatAtk.innerText = fillDots(data.stats[1].base_stat, 'atk')
    // pokeStatDef.innerText = fillDots(data.stats[2].base_stat, 'def')
    // pokeStatSpAtk.innerText = '●'.repeat(data.stats[3].base_stat*10 / maxStats.spAtk)
    // pokeStatSpDef.innerText = '●'.repeat(data.stats[4].base_stat*10 / maxStats.spDef)
    // pokeStatSpeed.innerText = '●'.repeat(data.stats[5].base_stat*10 / maxStats.spd)


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


function fillDots(value, stat) {
maxStats = {
  'hp': 255,
  'atk': 180,
  'def': 230,
  'spAtk': 180,
  'spDef': 230,
  'spd': 180,
}

'◐'
return ('●'.repeat(value*10 / maxStats[stat]) + '○○○○○○○○○○').slice(0, 10)
}



function toCapitalCase(word) {
    if (word) {
    return word.replace(/-/g, ' ')
               .replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()))
    }
  }

