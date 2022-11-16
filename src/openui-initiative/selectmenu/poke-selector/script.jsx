import "../../../../net/experimental-web-platform/script.js";
import React from 'react'
import { createRoot } from 'react-dom/client'

const ROOT = createRoot(document.querySelector('#app'))

const WAIT_TIME = 4000

const App = () => {
  const selectMenuRef = React.useRef(null)
  const selectedRef = React.useRef(null)

  const [loading, setLoading] = React.useState(true)
  const [options, setOptions] = React.useState(false)
  const [data, setData] = React.useState(false)
  const [selected, setSelected] = React.useState(null)

  // Here we need to populate the selected state to update the button slot
  const onInput = () => {
    const selected = data.filter(poke => poke.id === parseInt(selectMenuRef.current.value, 10))[0]
    setSelected(selected)
  }

  // Populate the options from the Pokémon API
  React.useEffect(() => {
    const grabTheOneFiftyOne = async () => {
      const result = await(await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')).json()
      // Loop over all the results and create fetch calls that are added into a Promise.all
      const CALLS = []
      const DATA = []
      result.results.forEach(result => {
        const pokeGrab = new Promise(async (resolve, reject) => {
          const poke = await(await fetch(result.url)).json()
          DATA.push(poke)
          // Fake the return time because these APIs are just too quick...
          setTimeout(() => resolve(poke), WAIT_TIME)
        })
        CALLS.push(pokeGrab)
      })
      await Promise.all(CALLS)

      // Sort the data by type
      const SORTED_POKE = {}
      DATA.forEach(pokemon => {
        // Populate the types
        pokemon.types.forEach(pokeType => {
          if (!SORTED_POKE[pokeType.type.name]) SORTED_POKE[pokeType.type.name] = []
          SORTED_POKE[pokeType.type.name].push({
            ...pokemon
          })
        })
      })
      setLoading(false)
      setData(DATA)
      setOptions(SORTED_POKE)
    }
    grabTheOneFiftyOne()
  }, [])

  return (
    <>
      <selectmenu
        className="pokeselect"
        data-loading={loading}
        ref={selectMenuRef}
        onInput={onInput}
      >
        <div slot="button">
          <button behavior="button" disabled={loading}>
            <span className="pokeselect__image-placeholder">
              {loading && <img className="pokeselect__ball" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="" />}
              {!loading && !selected && <img className="pokeselect__choose" src="https://assets.codepen.io/5928893/question.png" alt="" />} 
              {selected && <img className="pokeselect__avatar" src={selected.sprites.front_default} alt=""/>}
            </span>
            {!selected && <span className="pokeselect__placeholder">Select Pokémon</span>} 
            {selected && <span>{`${selected.name.charAt(0).toUpperCase()}${selected.name.slice(1)}`}</span>}
            <svg viewBox="0 0 320 512" title="angle-down">
              <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" />
            </svg>
            {/*<span behavior="selected-value" slot="selected-value" ref={selectedRef}>

            </span>*/}
          </button>
        </div>
        <div slot="listbox">
          <div popover="auto" behavior="listbox">
            {options && Object.keys(options).length && Object.keys(options).map((group) => {
              return (
                <optgroup key={`group--${group}`}label={`${group.charAt(0).toUpperCase()}${group.slice(1)}`}>
                  {options[group].map(pokemon => {
                    return (
                      <option value={pokemon.id} id={`${group}--${pokemon.id}`} key={`${group}--${pokemon.id}`}>
                        <img src={pokemon.sprites.front_default} alt="" />
                        <span className="pokeselect__details">
                          <span className="pokeselect__title">{`${pokemon.name.charAt(0).toUpperCase()}${pokemon.name.slice(1)}`}</span>
                          <span className="pokeselect__stats">
                            <span><sub>HP</sub>{pokemon.stats[0].base_stat}</span>
                            <span><sub>AT</sub>{pokemon.stats[1].base_stat}</span>
                            <span><sub>DF</sub>{pokemon.stats[2].base_stat}</span>
                          </span>
                        </span>
                      </option>
                    )
                  })}
                </optgroup>
              )
            })}
          </div>
        </div>
      </selectmenu>
    </>
  )
}

ROOT.render(<App/>)