import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import './ease-generator.js'

const ROOT_NODE = document.querySelector('#app')

const EASINGS = [
  'none',
  'power1.in',
  'power1.out',
  'power1.inOut',
  'power2.in',
  'power2.out',
  'power2.inOut',
  'power3.in',
  'power3.out',
  'power3.inOut',
  'power4.in',
  'power4.out',
  'power4.inOut',
  'back.in',
  'back.out',
  'back.inOut',
  'bounce.in',
  'bounce.out',
  'bounce.inOut',
  'circ.in',
  'circ.out',
  'circ.inOut',
  'elastic.in',
  'elastic.out',
  'elastic.inOut',
  'expo.in',
  'expo.out',
  'expo.inOut',
  'sine.in',
  'sine.out',
  'sine.inOut',
  'steps',
]

window.customEases = {}

const buildEases = (accuracy = 0.0025, rounding = 4) => {
  let eases = ''
  for (const EASE of EASINGS) {
    if (EASE === 'none') {
      window.customEases[EASE] = generateCustomEase(EASE, accuracy, rounding, 1)
      eases += `--${EASE}: ${window.customEases[EASE].output};`
    } else if (EASE === 'steps') {
      window.customEases[EASE] = generateCustomEase('steps(10)', accuracy, rounding, 1)
      eases += `--${EASE}: ${window.customEases[EASE].output};`
    } else {
      window.customEases[EASE] = generateCustomEase(EASE, accuracy, rounding, 1)
      eases += `--${EASE.replace('.', '-')}: ${window.customEases[EASE].output};`
    }
  }
  return `:root {${eases}}`
}

// buildEases()

// This could be the string you get...

const generatePointsString = easeKey => {
  let result = ''
  const ease = customEases[easeKey]
  if (ease) {
    for (const point of ease.optimised) result += `${point[0]},${point[1]} `
  }
  return result
}

const Graph = ({ ease }) => {
  const points = generatePointsString(ease)
  return (
    <svg className="graph" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg" >
      <title>Linear() easing graph</title>
      <polyline className="x" points="0,0 0,1" stroke="blue" stroke-width="0.01"/>
      <polyline className="y" points="0,0 1,0" stroke="orange" stroke-width="0.01"/>
      <polyline className="l" fill="none" points={points} stroke-linecap="round" stroke-linejoin="round" stroke="purple" stroke-width="0.02" pathLength={1} />
    </svg>
  )
}

const App = () => {
  const [accuracy, setAccuracy] = React.useState(0.0025)
  const [rounding, setRounding] = React.useState(4)
  const [duration, setDuration] = React.useState(2)
  const [selectedEase, setSelectedEase] = React.useState(EASINGS[0])
  const [customStyles, setCustomStyles] = React.useState('')

  React.useEffect(() => {
    setCustomStyles(buildEases(accuracy, rounding))
  }, [accuracy, rounding])

  React.useEffect(() => {
    document.documentElement.style.setProperty('--duration', duration)
  }, [duration])

  React.useEffect(() => {
    document.documentElement.style.setProperty('--ease', `var(--${selectedEase.replace('.', '-')})`)
  }, [selectedEase])

  return (
    <>
      <h1>CSS Easing 2024</h1>
      <select value={selectedEase} onChange={event => setSelectedEase(event.target.value)}>
        {EASINGS.map(ease => (
          <option key={ease}>{ease}</option>
        ))}
      </select>
      <form>
        <label htmlFor="accuracy">Accuracy</label>
        <input
          id="accuracy"
          type="range"
          min="0"
          max="0.01"
          step="0.0001"
          value={accuracy}
          onChange={(event) => setAccuracy(event.target.value)}
        />
        <label htmlFor="rounding">Rounding</label>
        <input
          id="rounding"
          type="range"
          min="1"
          max="5"
          step="1"
          value={rounding}
          onChange={(event) => setRounding(event.target.value)}
        />
        <label htmlFor="duration">Duration (s)</label>
        <input
          id="duration"
          type="range"
          min="0.2"
          max="10"
          step="0.1"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
        />
      </form>
      <h2>{accuracy}</h2>
      <style type="text/css">
        {customStyles}
      </style>
      <div className="arena">
        <div className="box"/>
        <Graph ease={selectedEase} />
      </div>
    </>
  )
}

render(<App />, ROOT_NODE)
