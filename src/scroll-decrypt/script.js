import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import Splitting from 'https://cdn.skypack.dev/splitting'

const heading = document.querySelector('.encrypted')

const config = {
  debug: false,
  title: 'Pretty cool',
  sub: 'Translate clipped text on scroll',
  theme: 'system',
  track: 10,
  start: 1,
  end: -0.2,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const randomString = (length) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?~'
  return [...Array(length)]
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('')
}

// For escaping the special characters for HTML output:
const escapeHTML = (str) =>
  str.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[char])
  )

const getWords = (txt) => {
  const hold = Object.assign(document.createElement('div'), {
    innerHTML: Splitting.html({ content: txt, whitespace: true }),
  })

  const chars = hold.querySelectorAll('.char, .whitespace')
  hold.firstChild.setAttribute('aria-hidden', 'true')
  for (let c = 0; c < chars.length; c++) {
    const char = chars[c]
    char.dataset.char = char.innerHTML
    char.innerHTML = `<span>${char.innerHTML}${escapeHTML(
      randomString(config.track)
    )}</span>`
  }

  return hold.innerHTML
}

const update = () => {
  heading.innerHTML = `
    <h1>
      <span class="sr-only">${config.title}</span>
      ${getWords(config.title)}
    </h1>
    <p>
      <span class="sr-only">${config.sub}</span>
      ${getWords(config.sub)}
    </p>
  `
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.debug = config.debug
  document.documentElement.style.setProperty('--track', config.track)
  document.documentElement.style.setProperty('--start', config.start)
  document.documentElement.style.setProperty('--end', config.end)
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'title', {
  label: 'Text',
})
ctrl.addBinding(config, 'sub', {
  label: 'Sub',
})
ctrl.addBinding(config, 'track', {
  min: 2,
  max: 50,
  step: 1,
  label: 'Chars',
})
const range = ctrl.addFolder({ title: 'Range Step' })
range.addBinding(config, 'start', {
  min: -10,
  max: 10,
  step: 0.01,
  label: 'Start',
})
range.addBinding(config, 'end', {
  min: -10,
  max: 10,
  step: 0.01,
  label: 'End',
})

ctrl.addBinding(config, 'debug', {
  label: 'Debug',
})

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
