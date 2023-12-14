import { GUI } from 'https://cdn.skypack.dev/dat.gui'
import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.querySelector('#app')

const CONFIG = {
  min: 0,
  max: 2000,
  step: 0.01,
  default: 1010,
  pad: false,
  explode: false,
  ease: 'elastic.inOut',
  transition: 2,
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const Character = ({ key, value }) => {
  return (
    <span className="character">
      <span className="character__track" style={{ '--v': value }}>
        <span>9</span>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val, index) => {
          return <span key={`${key}--${index}`}>{val}</span>
        })}
        <span>0</span>
      </span>
    </span>
  )
}

const Counter = ({ pad, value }) => {
  console.info({
    pad,
    value,
    m: CONFIG.max.toFixed(2),
    v: value.toFixed(2),
    padCount:
      CONFIG.max.toFixed(2).toString().length -
      value.toFixed(2).toString().length,
  })

  const renderValue = formatter.format(value)

  const padCount = pad ? CONFIG.max.toFixed(2).toString().length -
      value.toFixed(2).toString().length : 0
  
  const renderParts = formatter.formatToParts(value)

  console.info({ renderParts })

  return (
    <div className="counter">
      <fieldset>
        <legend>MRR</legend>
        <h2>
          <span className="sr-only">{renderValue}</span>
          <span aria-hidden="true" className="characters">
            {renderParts.map((part, index) => {
              // if "integer" or "fraction", render split number and pad if necessary
              if (part.type !== 'fraction' && part.type !== 'integer') {
                return (
                  <span className="character character--symbol" key={index}>
                    {part.value}
                  </span>
                )
              }
              // Here pad out the value if the padCount exists
              let val = part.value
              console.info({ pad, index})
              if (pad && index === 1) {
                val = val.toString().padStart(padCount + val.length, '0')
                console.info({ val })
              }
              return val.split('').map((digit, index) => {
                return <Character key={index} value={digit} />
              })
            })}
          </span>
        </h2>
      </fieldset>
    </div>
  )
}

const App = () => {
  const [value, setValue] = React.useState(CONFIG.default)
  // Create state and refs for the controller
  const [max, setMax] = React.useState(CONFIG.max)
  const [min, setMin] = React.useState(CONFIG.min)
  const [step, setStep] = React.useState(CONFIG.step)
  const [pad, setPad] = React.useState(CONFIG.pad)
  // const [pad, setPad] = React.useState(CONFIG.pad)
  const minController = React.useRef(null)
  const maxController = React.useRef(null)
  const stepController = React.useRef(null)
  const padController = React.useRef(null)
  const transitionController = React.useRef(null)
  React.useEffect(() => {
    const UPDATE = () => {
      minController.current.max(CONFIG.max - 1)
      maxController.current.min(CONFIG.min + 1)
      stepController.current.max(CONFIG.max)
      setMin(CONFIG.min)
      setMax(CONFIG.max)
      setStep(CONFIG.step)
      setPad(CONFIG.pad)
      document.documentElement.style.setProperty(
        '--transition',
        CONFIG.transition
      )
    }
    // Set up the controller.
    const CTRL = new GUI({ width: 320 })
    minController.current = CTRL.add(CONFIG, 'min', 0, CONFIG.max - 1, 1)
      .name('Min')
      .onChange(UPDATE)
    maxController.current = CTRL.add(CONFIG, 'max', CONFIG.min + 1, 10000, 1)
      .name('Max')
      .onChange(UPDATE)
    stepController.current = CTRL.add(CONFIG, 'step', 0.01, CONFIG.max, 0.01)
      .name('Step')
      .onChange(UPDATE)
    padController.current = CTRL.add(CONFIG, 'pad').name('Pad').onChange(UPDATE)
    transitionController.current = CTRL.add(CONFIG, 'transition', 0, 5, 0.05)
      .name('Transition (s)')
      .onChange(UPDATE)
    UPDATE()
  }, [])

  return (
    <>
      <Counter pad={pad} value={value} />
      <input
        onInput={(event) => setValue(parseInt(event.target.value, 10))}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
      />
    </>
  )
}

render(<App />, ROOT_NODE)
