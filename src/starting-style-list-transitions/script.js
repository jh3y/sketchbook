import { Pane } from 'https://cdn.skypack.dev/tweakpane'
const list = document.querySelector('ul')

const syncList = () => {
  list.style.setProperty(
    '--items',
    list.querySelectorAll('li:not([hidden])').length
  )
  for (let c = 0; c < list.children.length; c++) {
    list.children[c].style.setProperty('--index', c)
  }
}

const pushItem = () => {
  const li = Object.assign(document.createElement('li'), {
    innerHTML: `
      <div class="polaroid__wrapper">
        <figure class="polaroid">
          <img class="polaroid__img" alt="" src="https://picsum.photos/300/300?random=${Date.now()}" />
        </figure>
        <div class="polaroid__shadow" />
      </div>
    `,
  })
  list.appendChild(li)
  li.addEventListener('click', async () => {
    li.hidden = true
    list.style.setProperty(
      '--items',
      list.querySelectorAll('li:not([hidden])').length
    )
    await Promise.allSettled(li.getAnimations().map((a) => a.finished))
    li.remove()
    syncList()
  })
  syncList()
}

const popItem = async () => {
  const items = list.querySelectorAll('li:not([hidden])')
  const item = items[items.length - 1]
  item.hidden = true
  list.style.setProperty(
    '--items',
    list.querySelectorAll('li:not([hidden])').length
  )
  await Promise.allSettled(item.getAnimations().map((a) => a.finished))
  item.remove()
  syncList()
}

const config = {
  theme: 'system',
  stagger: false,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const push = ctrl.addButton({ title: 'Push' })
push.on('click', pushItem)
const pop = ctrl.addButton({ title: 'Pop' })
pop.on('click', popItem)
ctrl.addBinding(config, 'stagger', {
  label: 'Stagger',
})
ctrl.addBinding(config, 'theme', {
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
  label: 'Theme',
})

const sync = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.stagger = config.stagger
}

sync()

const handle = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return sync()
  document.startViewTransition(() => sync())
}

const build = () => {
  pushItem()
  if (list.children.length < 3) requestAnimationFrame(build)
}
build()

ctrl.on('change', handle)
