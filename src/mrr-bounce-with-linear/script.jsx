import { GUI } from 'https://cdn.skypack.dev/dat.gui'
import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.querySelector('#app')

const CONFIG = {
  min: 0,
  max: 20000,
  step: 0.01,
  value: 12010.0,
  pad: true,
  explode: false,
  ease: 'elastic.inOut',
  transition: 2,
  currency: 'USD',
  ease: 'elastic',
  easeOptions: [
    'back',
    'basic',
    'bounce',
    'circ',
    'elastic',
    'expo',
    'power',
    'sine',
  ],
  currencyOptions: ['USD', 'GBP', 'EUR'],
}

const FORMATTERS = {
  USD: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }),
  GBP: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
  }),
  EUR: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }),
  YEN: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'YEN',
  }),
}

const Character = ({ className, key, value }) => {
  return (
    <span data-value={value} className={`character ${className || ''}`}>
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

const Counter = ({ currency, pad, value }) => {
  const padCount = pad
    ? CONFIG.max.toFixed(2).toString().length - value.toString().length
    : 0

  const paddedValue = value
    .toString()
    .padStart(value.toString().length + padCount, '1')

  let i = 0
  const renderValue = FORMATTERS[currency]
    .format(paddedValue)
    .split('')
    .map((character, index) => {
      if (!isNaN(parseInt(character, 10)) && i < padCount) {
        i++
        return '0'
      }
      return character
    })
    .join('')

  return (
    <div className="counter">
      <fieldset>
        <legend>MRR</legend>
        <h2>
          <span className="sr-only">{renderValue}</span>
          <span aria-hidden="true" className="characters">
            {renderValue.split('').map((character, index) => {
              if (isNaN(parseInt(character, 10)))
                return (
                  <span key={index} className="character character--symbol">
                    {character}
                  </span>
                )
              return (
                <Character
                  key={index}
                  value={character}
                  className={
                    index > renderValue.split('').length - 3 ? 'fraction' : ''
                  }
                />
              )
            })}
          </span>
        </h2>
      </fieldset>
    </div>
  )
}

const App = () => {
  const [value, setValue] = React.useState(CONFIG.value.toFixed(2))
  // Create state and refs for the controller
  const [max, setMax] = React.useState(CONFIG.max)
  const [min, setMin] = React.useState(CONFIG.min)
  const [step, setStep] = React.useState(CONFIG.step)
  const [pad, setPad] = React.useState(CONFIG.pad)
  const [currency, setCurrency] = React.useState(CONFIG.currency)
  // const [pad, setPad] = React.useState(CONFIG.pad)
  const minController = React.useRef(null)
  const maxController = React.useRef(null)
  const stepController = React.useRef(null)
  const padController = React.useRef(null)
  const transitionController = React.useRef(null)
  const currencyController = React.useRef(null)
  const valueController = React.useRef(null)
  const easeController = React.useRef(null)
  React.useEffect(() => {
    const UPDATE = () => {
      minController.current.max(CONFIG.max - 1)
      maxController.current.min(CONFIG.min + 1)
      stepController.current.max(CONFIG.max)
      valueController.current.max(CONFIG.max)
      valueController.current.min(CONFIG.min)
      valueController.current.step(CONFIG.step)
      setMin(CONFIG.min)
      setMax(CONFIG.max)
      setStep(CONFIG.step)
      setPad(CONFIG.pad)
      setCurrency(CONFIG.currency)
      setValue(CONFIG.value.toFixed(2))
      document.documentElement.style.setProperty(
        '--transition',
        CONFIG.transition
      )
      document.documentElement.style.setProperty(
        '--ease',
        `var(--${CONFIG.ease})`
      )
    }
    // Set up the controller.
    const CTRL = new GUI({ width: 320 })
    const valueFolder = CTRL.addFolder('Config')
    minController.current = valueFolder.add(CONFIG, 'min', 0, CONFIG.max - 1, 1)
      .name('Min')
      .onChange(UPDATE)
    maxController.current = valueFolder.add(CONFIG, 'max', CONFIG.min + 1, 1000000, 1)
      .name('Max')
      .onChange(UPDATE)
    stepController.current = valueFolder.add(CONFIG, 'step', 0.01, CONFIG.max, 0.01)
      .name('Step')
      .onChange(UPDATE)
    padController.current = valueFolder.add(CONFIG, 'pad').name('Pad').onChange(UPDATE)
    currencyController.current = valueFolder.add(
      CONFIG,
      'currency',
      CONFIG.currencyOptions
    )
      .name('Currency')
      .onChange(UPDATE)
    transitionController.current = CTRL.add(CONFIG, 'transition', 0, 5, 0.05)
      .name('Transition (s)')
      .onChange(UPDATE)
    easeController.current = CTRL.add(CONFIG, 'ease', CONFIG.easeOptions)
      .name('Easing')
      .onChange(UPDATE)
    valueController.current = CTRL.add(
      CONFIG,
      'value',
      CONFIG.min,
      CONFIG.max,
      CONFIG.step
    )
      .name('Value')
      .onChange(UPDATE)
    CTRL.add(CONFIG, 'explode').name('Explode?').onChange(() => {
      document.documentElement.toggleAttribute('data-explode')
    })
    UPDATE()
  }, [])

  return (
    <>
      <Counter pad={pad} value={value} currency={currency} />
      <Counter pad={pad} value={value} currency={currency} />
    </>
  )
}

render(<App />, ROOT_NODE)
