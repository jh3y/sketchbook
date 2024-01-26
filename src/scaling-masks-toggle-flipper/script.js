import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const FORM = document.querySelector('form')
const TOGGLE = document.querySelector('.theme-toggle')
const ICON = TOGGLE.querySelector('svg')

const CONFIG = {
  speed: 1000,
  center: false,
}

const applyChange = () => {
  const isDark = TOGGLE.matches('[aria-pressed=true]') ? false : true
  console.info({ isDark })
  TOGGLE.setAttribute('aria-pressed', isDark)
  // document.querySelector('img').src = `https://picsum.photos/1280/720?random=${isDark ? 12 : 10}`
  document.documentElement.className = isDark ? 'dark' : 'light'
}

const darkEase = `linear(0, 0.1641 3.52%, 0.311 7.18%,0.4413 10.99%, 0.5553 14.96%,0.6539 19.12%, 0.738 23.5%,0.8086 28.15%, 0.8662 33.12%,0.9078 37.92%, 0.9405 43.12%,0.965 48.84%, 0.9821 55.28%,0.992 61.97%, 0.9976 70.09%, 1)`
const lightEase = `linear(0, 0.0024 29.91%, 0.008 38.03%,0.0179 44.72%, 0.035 51.16%,0.0595 56.88%, 0.0922 62.08%,0.1338 66.88%, 0.1914 71.85%,0.262 76.5%, 0.3461 80.88%,0.4447 85.04%, 0.5587 89.01%,0.689 92.82%, 0.8359 96.48%, 1)`
const toggleTheme = (event) => {
  event.preventDefault()
  const isDark = TOGGLE.matches('[aria-pressed=true]') ? false : true
  if (!document.startViewTransition) applyChange()
  const transition = document.startViewTransition(() => applyChange())

  const iconBounds = ICON.getBoundingClientRect()
  const startX = iconBounds.left + iconBounds.width * 0.5
  const startY = iconBounds.top + iconBounds.height * 0.5

  // const diameter = Math.hypot(
  //   Math.max(startX, innerWidth - startX),
  //   Math.max(startY, innerHeight - startY)
  // )

  const diameter = Math.max(window.innerHeight, window.innerWidth)

  const end = isDark ? CONFIG.center ? diameter * 30 : diameter * 20 : diameter * 5

  let maskPosition = !isDark
    ? [
        `${startX}px ${startY}px`,
        `${startX - end * 0.5}px ${startY - end * 0.5}px`,
      ]
    : [
        `${startX - end * 0.4}px ${startY - end * 0.5}px`,
        `${startX}px ${startY}px`,
      ] 

  if (CONFIG.center) maskPosition = [ '50% 50%', '50% 50%' ]

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        maskPosition,
        maskSize: !isDark
          ? ['0 0', `${end}px ${end}px`]
          : [`${end}px ${end}px`, '0 0'],
      },
      {
        duration: CONFIG.speed,
        easing: isDark ? darkEase : lightEase,
        pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
      }
    )
  })
}

FORM.addEventListener('submit', toggleTheme)

// const CONFIG = {
//   track: false
// }
// const CONFIG_ONE = {
//   x: 50,
//   y: 50,
//   size: 10
// }
// const CONFIG_TWO = {
//   x: 50,
//   y: 50,
//   size: 10
// }


const CTRL = new Pane({ container: document.querySelector('.tp-container') })
CTRL.addBinding(CONFIG, 'speed', { min: 500, max: 10_000, step: 1 })
CTRL.addBinding(CONFIG, 'center')
// const ONE = document.querySelector('.box--one')
// const TWO = document.querySelector('.box--two')

// const update = () => {
//   console.info('update')
//   ONE.style.setProperty('--x', CONFIG_ONE.x)
//   ONE.style.setProperty('--y', CONFIG_ONE.y)
//   ONE.style.setProperty('--size', CONFIG_ONE.size)

//   TWO.style.setProperty('--x', CONFIG.track ? (CONFIG_ONE.x + CONFIG_ONE.size * 0.5) - (CONFIG_TWO.size * 0.5) : CONFIG_TWO.x)
//   TWO.style.setProperty('--y', CONFIG.track ? (CONFIG_ONE.y + CONFIG_ONE.size * 0.5) - (CONFIG_TWO.size * 0.5) : CONFIG_TWO.y)
//   TWO.style.setProperty('--size', CONFIG_TWO.size)

// }

// const folderOne = CTRL.addFolder({ title: 'Box One'})
// folderOne.addBinding(CONFIG_ONE, 'x', { min: 0, max: 100, step: 1, value: 0 })
// folderOne.addBinding(CONFIG_ONE, 'y', { min: 0, max: 100, step: 1, value: 0 })
// folderOne.addBinding(CONFIG_ONE, 'size', { min: 0, max: 2000, step: 1, value: 10 })
// const folderTwo = CTRL.addFolder({ title: 'Box Two'})
// folderTwo.addBinding(CONFIG_TWO, 'x', { min: 0, max: 100, step: 1, value: 0 })
// folderTwo.addBinding(CONFIG_TWO, 'y', { min: 0, max: 100, step: 1, value: 0 })
// folderTwo.addBinding(CONFIG_TWO, 'size', { min: 0, max: 2000, step: 1, value: 10 })
// // Last piece is whether you want to track the mask position
// CTRL.addBinding(CONFIG, 'track')

// CTRL.on('change', update)
// update()
