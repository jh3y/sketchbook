import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

const config = {
  theme: 'system',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'theme', {
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
  label: 'Theme',
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
}

const sync = () => {
  if (!document.startViewTransition) update()
  document.startViewTransition(() => update())
}

ctrl.on('change', sync)

update()

const ROOT_NODE = document.querySelector('#app')
const CUISINES = [
  'Italian',
  'Chinese',
  'Indian',
  'American',
  'Mexican',
  'Japanese',
  'Thai',
  'Turkish',
  'Greek',
  'Spanish',
  'Mediterranean',
  'British',
  'Korean',
  'Vietnamese',
  'French',
  'Caribbean',
  'Lebanese',
  'Brazilian',
  'Ethiopian',
  'German',
  'Cuban',
  'Moroccan',
  'Russian',
  'Argentinian',
  'Peruvian',
  'Filipino',
]

const App = () => {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <fieldset>
        <legend>What are your favorite cuisines?</legend>
        <ul>
          {CUISINES.map((cuisine) => {
            return (
              <li key={cuisine}>
                <label>
                  <span>{cuisine}</span>
                  <span>
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                  <input className="sr-only" type="checkbox" />
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>
      <button type="reset">Reset</button>
    </form>
  )
}

render(<App />, ROOT_NODE)
