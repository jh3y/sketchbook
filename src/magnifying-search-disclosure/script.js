import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import { gsap } from 'https://cdn.skypack.dev/gsap@3.12.0'

const config = {
  handle: true,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'handle', { label: 'Hide Handle' })

const sync = () => {
  document.documentElement.dataset.handle = config.handle
}

ctrl.on('change', sync)

const trigger = document.querySelector('#trigger')
const search = document.querySelector('[type=search]')
const magnifier = document.querySelector('.magnifier')
const lens = magnifier.querySelector('rect')
const handle = magnifier.querySelector('line')
const form = document.querySelector('form')

const toggle = () => {
  if (trigger.dataset.busy === 'true') return console.info('busy')
  trigger.dataset.busy = true
  const pressed = trigger.matches('[aria-pressed="true"]')
  trigger.setAttribute('aria-pressed', pressed ? false : true)
  trigger.setAttribute('aria-expanded', pressed ? false : true)

  if (pressed) {
    gsap
      .timeline({
        onComplete: () => {
          trigger.dataset.busy = false
          trigger.focus()
          gsap.set(magnifier, {
            clearProps: '--intent, scale, yPercent',
          })
        },
      })
      .to(handle, {
        '--hide': 0,
        duration: 0.1,
      })
      .to(lens, {
        width: 40,
        x: 0,
        duration: 0.1,
      })
      .to(
        search,
        {
          '--closed': 1,
          duration: 0.1,
        },
        '<'
      )
      .set(search, {
        display: 'none',
      })
      .to(magnifier, {
        yPercent: 0,
        scale: 0.5,
        duration: 0.1,
      })
  } else {
    gsap
      .timeline({
        onComplete: () => {
          trigger.dataset.busy = false
          search.focus()
        },
      })
      .set(magnifier, {
        '--intent': 1,
      })
      .to(magnifier, {
        yPercent: 5,
        scale: 1,
        duration: 0.1,
      })
      .to(lens, {
        x: 20,
        width: 1,
        duration: 0.075,
        repeat: 2,
        yoyo: true,
        ease: 'power1.inOut',
      })
      .set(search, {
        display: 'block',
      })
      .to(lens, {
        x: -90,
        width: 220,
        duration: 0.35,
        // ease: 'power1.out',
        ease: 'elastic.out(1,0.75)',
      })
      .to(
        handle,
        {
          '--hide': 1,
          duration: 0.35,
        },
        '<'
      )
      .to(
        search,
        {
          '--closed': 0,
          duration: 0.35,
          // ease: 'power1.out',
          ease: 'elastic.out(1,0.75)',
        },
        '<'
      )
  }
}
search.addEventListener('keyup', (event) => {
  if (search.value.trim() === '' && event.key === 'Escape') {
    toggle()
  }
})
search.addEventListener('blur', toggle)
trigger.addEventListener('click', toggle)
form.addEventListener('submit', (event) => event.preventDefault())
sync()
