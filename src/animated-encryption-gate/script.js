import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import Splitting from 'https://cdn.skypack.dev/splitting'

const config = {
  theme: 'system',
  password: 'correct battery horse staple',
  // password: 'correct battery',
  // password: 'horse',
  offset: 2, // these number values refer to the number of characters (ch)
  start: -1,
  encrypt: 2,
  speed: 10,
  width: 30,
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const generateRandomString = (length) => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return result
}

// Thinking about this a bunch...
/**
 * 1. We know the length of the password
 * 2. We know the width of the container in "ch" units
 * 3. We can set the font-size responsively with "fluid"
 * 4. Generate a keyframe based on calculating distance: 1ch distance === total distance in ch / 100%
 */

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})
// Style tag to fill with generated keyframes
const styleTag = document.querySelector('#frames')

const setPassword = () => {
  const password = document.querySelector('.password')
  const encrypted = document.querySelector('.encrypted')
  password.innerText = config.password
  encrypted.innerHTML = generateRandomString(config.password.length)
    .split('')
    .map((character, i) => `<span style="--i: ${i}">${character}</span>`)
    .join('')
  const characterCount = config.password.split('').length
  document.documentElement.style.setProperty('--ch-count', characterCount)
  document.documentElement.style.setProperty('--ch-offset', config.offset)
  document.documentElement.style.setProperty('--ch-speed', config.speed)
  document.documentElement.style.setProperty('--container', config.width)
  // generate a delay that the characters will do their thing on
  // work out the delay for a 1ch travel: distance / time
  const delay =
    config.speed /
    (config.width + config.offset * 2 + config.password.split('').length)
  document.documentElement.style.setProperty('--ch-delay', delay)
}
setPassword()

// Now we need to calculate the keyframes across the window
// But start keyframe is going to be (3)
const containerWidth = config.width
const characterCount = config.password.split('').length
// This is the total window of characters that you need to move across
const total = containerWidth + config.offset * 2 + characterCount
document.documentElement.style.setProperty('--steps', total)

// start is going to be when the word crosses the midpoint so the character after
// const startIndex = total * 0.5
const startIndex = containerWidth * 0.5 + config.offset + config.start
const startFrame = startIndex / total
const endIndex = startIndex + config.encrypt
const endFrame = endIndex / total

console.info({ startIndex, startFrame, endIndex, endFrame })

// TODO:: Techincally if we want, we could animate each character individually
// The animation delay is total / 100 * duration for a 1ch delay...
// Start animating the characters individually for the encrypters.
// You can stop "encrypting" them at any point but perhaps you generate an animation count
// Or you generate individual delays and iterations based on the index???
const frames = `
  @keyframes highlight {
    0%, ${(startFrame * 100).toFixed(2)}% {
      color: canvasText;
    }
    ${(startFrame * 100 + 1).toFixed(2)}%,
    ${(endFrame * 100).toFixed(2)}% {
      color: red;
    }
    ${(endFrame * 100 + 1).toFixed(2)}%, 100% {
      color: blue;
    }
  }
`
styleTag.innerHTML = frames

const update = () => {
  document.documentElement.dataset.theme = config.theme
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
