import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const heading = document.querySelector('h1')

const config = {
  text: 'Hello World!',
  theme: 'system',
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

const update = () => {
  heading.innerHTML = `
    <span class="sr-only">${config.text}</span>
    ${config.text
      .split('')
      .map(
        (c, i) =>
          `<span style="--i: ${i};" data-char="${c}"><span>${
            c.trim() === '' ? '<span>&nbsp;</span>' : c
          }${escapeHTML(randomString(10))}</span><span>${
            c.trim() === '' ? '0' : c
          }</span></span>`
      )
      .join('')}
  `
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

ctrl.addBinding(config, 'text', {
  label: 'Text',
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
