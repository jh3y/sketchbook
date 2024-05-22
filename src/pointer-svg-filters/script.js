import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const CONFIG = {
  text: 'Check It!',
  type: 'magnify',
  scale: 40,
  size: 120,
  theme: 'system',
  animate: true,
}

const header = document.querySelector('h1')
const displacement = document.querySelector('#displacement')
const scribbles = document.querySelectorAll('[id*="scribble"] feDisplacementMap')

const CTRL = new Pane({
  title: 'Config',
  expanded: true
})
CTRL.addBinding(CONFIG, 'text', { label: 'Text' })
CTRL.addBinding(CONFIG, 'type', {
  options: {
    Magnify: 'magnify',
    Radiate: 'radiate'
  },
  label: 'Type'
})

const THEMER = CTRL.addBinding(CONFIG, 'theme', {
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark'
  },
  label: 'Theme'
})
CTRL.addBinding(CONFIG, 'size', { min: 50, max: 200, step: 1, label: 'Size (px)' })
CTRL.addBinding(CONFIG, 'scale', { min: -100, max: 100, step: 1, label: 'Scale' })

const ANIMATE = CTRL.addBinding(CONFIG, 'animate', { label: 'Animate' })

const sync = () => {
  header.innerText = CONFIG.text
  document.documentElement.dataset.theme = CONFIG.theme
  document.documentElement.dataset.type = CONFIG.type
  document.documentElement.dataset.animate = CONFIG.animate
  document.documentElement.style.setProperty('--size', CONFIG.size)
  const eff = document.querySelector('.effect')
  displacement.setAttribute('scale', CONFIG.scale)
  for (let s = 0; s < scribbles.length; s++) {
    scribbles[s].setAttribute('scale', s % 2 === 0 ? CONFIG.scale : CONFIG.scale * 1.5)
  }
  eff.replaceWith(Object.assign(document.createElement('div'), {
    className: 'effect',
    innerHTML: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.6758 35.6141C14.5653 30.7128 17.4018 26.2318 21.0231 22.4267C24.6445 18.6216 28.9798 15.5671 33.7816 13.4375" stroke="var(--shimmer)" stroke-width="8" stroke-linecap="round"/>
      </svg>
    `
  }))
  eff.remove()
  ANIMATE.disabled = CONFIG.type === 'magnify'
}

const handle = event => {
  if (!document.startViewTransition || event.target.controller.view.labelElement.innerText !== 'Theme') return sync()
  document.startViewTransition(() => sync())
}


CTRL.on('change', handle)

sync()

const updatePos = ({ x, y }) => {
  document.documentElement.style.setProperty('--x', x)
  document.documentElement.style.setProperty('--y', y)
}

window.addEventListener('pointermove', updatePos)