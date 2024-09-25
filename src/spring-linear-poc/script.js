import { generateLinear, generateCustomEase } from './ease-generator'
import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const defaultSimplified = 0.0025
const defaultRounded = 4
const offset = 1

// function createIntuitiveSpringEasing(dampingRatio, naturalFrequency, duration) {
//   // Derived parameters
//   const omegaD = naturalFrequency * Math.sqrt(1 - dampingRatio * dampingRatio) // Damped angular frequency

//   // Function to calculate position x(t) for a given time
//   function x(t) {
//     const decay = Math.exp(-dampingRatio * naturalFrequency * t)
//     return (
//       decay *
//       (Math.cos(omegaD * t) +
//         ((dampingRatio * naturalFrequency) / omegaD) * Math.sin(omegaD * t))
//     )
//   }

//   // Calculate normalization constants
//   const xMax = x(0) // Should be 1
//   const xMin = x(duration)

//   // Return the easing function which maps t in [0, 1] to easing value in [0, 1]
//   return function (t) {
//     const time = t * duration // Scale t to actual time
//     const position = x(time) // Get position at this time
//     const normalized = (position - xMin) / (xMax - xMin) // Normalize to [0, 1]
//     return 1 - normalized // Invert the output for reversing
//   }
// }

// function createIntuitiveSpringEasing(dampingRatio, naturalFrequency, duration) {
//   // Scale the frequency to match the desired duration
//   const scaledFrequency = (naturalFrequency * 2 * Math.PI) / duration // Adjust frequency based on duration

//   // Derived parameters
//   const omegaD = scaledFrequency * Math.sqrt(1 - dampingRatio * dampingRatio) // Damped angular frequency

//   // Function to calculate the position x(t) for a given time
//   function x(t) {
//     const decay = Math.exp(-dampingRatio * scaledFrequency * t)
//     return (
//       decay *
//       (Math.cos(omegaD * t) +
//         ((dampingRatio * scaledFrequency) / omegaD) * Math.sin(omegaD * t))
//     )
//   }

//   // Calculate normalization constants to fit the easing into [0, 1]
//   const xMax = x(0) // Should be 1
//   const xMin = x(duration)

//   // Return the easing function which maps t in [0, 1] to easing value in [0, 1]
//   return function (t) {
//     const time = t * duration // Scale t to actual time
//     const position = x(time) // Get position at this time
//     const normalized = (position - xMin) / (xMax - xMin) // Normalize to [0, 1]
//     return 1 - normalized // Invert the output for reversing
//   }
// }
//

function createIntuitiveSpringEasing(dampingRatio, naturalFrequency) {
  // Calculate the natural duration based on the damping and frequency
  const suggestedDuration = 4.6 / (dampingRatio * naturalFrequency)

  // Scaled frequency to fit the suggested duration
  const scaledFrequency = (naturalFrequency * 2 * Math.PI) / suggestedDuration

  // Derived parameters
  const omegaD = scaledFrequency * Math.sqrt(1 - dampingRatio * dampingRatio) // Damped angular frequency

  // Function to calculate the position x(t) for a given time
  function x(t) {
    const decay = Math.exp(-dampingRatio * scaledFrequency * t)
    return (
      decay *
      (Math.cos(omegaD * t) +
        ((dampingRatio * scaledFrequency) / omegaD) * Math.sin(omegaD * t))
    )
  }

  // Calculate normalization constants to fit the easing into [0, 1]
  const xMax = x(0) // Should be 1
  const xMin = x(suggestedDuration)

  // Return an object with the easing function and the suggested duration
  return {
    easingFunction: function (t) {
      const time = t * suggestedDuration // Scale t to actual time
      const position = x(time) // Get position at this time
      const normalized = (position - xMin) / (xMax - xMin) // Normalize to [0, 1]
      return 1 - normalized // Invert the output for reversing
    },
    suggestedDuration: suggestedDuration,
  }
}

const config = {
  theme: 'system',
  dampingRatio: 0.5,
  naturalFrequency: 15,
  duration: 2,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const main = document.querySelector('main')

const update = () => {
  document.documentElement.dataset.theme = config.theme

  // Create new ease
  const spring = createIntuitiveSpringEasing(
    config.dampingRatio,
    config.naturalFrequency,
    config.duration
  )

  const ease = generateLinear(
    'my-ease',
    spring.easingFunction,
    defaultSimplified,
    defaultRounded,
    offset
  )

  document.documentElement.style.setProperty('--spring', ease.output)
  document.documentElement.style.setProperty(
    '--duration',
    spring.suggestedDuration
  )

  config.duration = spring.suggestedDuration
  ctrl.refresh()

  main.innerHTML = ''
  requestAnimationFrame(() => (main.innerHTML = '<div class="ball"></div>'))
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

ctrl.on('change', sync)
update()

ctrl.addBinding(config, 'dampingRatio', {
  min: 0,
  max: 2,
  step: 0.01,
  label: 'Damping Ratio',
})
ctrl.addBinding(config, 'naturalFrequency', {
  min: 0,
  max: 30,
  step: 1,
  label: 'Natural Frequency',
})
const dur = ctrl.addBinding(config, 'duration', {
  min: 0,
  max: 30,
  step: 0.01,
  disabled: true,
  label: 'Duration (s)',
})
