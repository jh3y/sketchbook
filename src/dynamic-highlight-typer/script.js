import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'

const config = {
  theme: 'system',
  cursor: 0,
  delay: 1,
  probability: 0.2,
  block: '#0bba20',
  content: '#0bba20',
  debug: false,
  text: `The CSS Custom Highlight API gives you a way to create typing animations using the ::highlight pseudoelement and without changing DOM content. Pretty cool. ʕ•ᴥ•ʔ`,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.debug = config.debug
  document.documentElement.style.setProperty('--cursor', config.block)
  document.documentElement.style.setProperty('--content', config.content)
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

const p = document.querySelector('p')

const getTextNodes = (el) => {
  const allTextNodes = []
  const treeWalker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  let currentNode = treeWalker.nextNode()
  while (currentNode) {
    allTextNodes.push(currentNode)
    currentNode = treeWalker.nextNode()
  }
  return allTextNodes
}
const getRanges = (textNode) => {
  const ranges = []

  // Need to create two ranges here.
  // 1. Cursor. 2. Content.
  const cursor = new Range()
  const content = new Range()

  cursor.setStart(textNode, 0)
  cursor.setEnd(textNode, 1)

  content.setStart(textNode, 0)
  content.setEnd(textNode, 0)

  ranges.push(cursor, content)

  return ranges
}

let dirty = false
// Create a full range highlight
const typewrite = (el) => {
  const [node] = getTextNodes(el)
  const [cursor, content] = getRanges(node)
  const cursorHighlight = new Highlight(cursor)
  const contentHighlight = new Highlight(content)
  CSS.highlights.set('cursor', cursorHighlight)
  CSS.highlights.set('content', contentHighlight)
  // Then animate the index of the range
  let start = 0
  let paused = false
  // Initially paused
  document.documentElement.dataset.paused = true
  const update = () => {
    if (paused) return

    document.documentElement.dataset.paused = false

    if (start === node.textContent.length - 1) {
      document.documentElement.dataset.paused = true
      dirty = true
      gsap.ticker.remove(update)
    }

    cursor.setStart(node, start)
    cursor.setEnd(node, start + 1)
    content.setEnd(node, start)

    config.cursor = start
    ctrl.refresh()

    start = start + 1

    if (
      Math.random() > 1 - config.probability &&
      p.textContent.charAt(start - 1) === ' '
    ) {
      paused = true
      gsap.ticker.fps(gsap.utils.random(8, 22, 1))
      document.documentElement.dataset.paused = true
      setTimeout(() => {
        paused = false
        document.documentElement.dataset.paused = false
      }, gsap.utils.random(0.2, 2, 0.1) * 1000)
    }
  }
  gsap.ticker.fps(12)
  const kick = gsap.delayedCall(config.delay, () => {
    gsap.ticker.add(update)
  })

  return { cursor, content, node, update, kick }
}

let node
let cursorRange
let cursor
let content
let kick

const generate = () => {
  dirty = false
  p.innerHTML = `${config.text.replace(/\s+/g, ' ').trim()}&nbsp;`.trim()
  const res = typewrite(p)
  cursor = res.cursor
  content = res.content
  node = res.node
  kick = res.kick
}

generate()

const killType = () => {
  if (kick) kick.kill()
  gsap.ticker._listeners.forEach((t) => {
    if (t.name === 'update') gsap.ticker.remove(t)
  })
}

ctrl
  .addBinding(config, 'text', {
    label: 'Content',
  })
  .on('change', () => {
    config.cursor = 0
    ctrl.refresh()
    killType()
    generate()
    cursorRange.max = node.textContent.length - 1
  })

cursorRange = ctrl
  .addBinding(config, 'cursor', {
    min: 0,
    max: node.textContent.length - 1,
    step: 1,
    label: 'Cursor',
  })
  .on('change', (event) => {
    if (dirty) {
      content.setEnd(node, config.cursor)
      cursor.setStart(node, config.cursor)
      cursor.setEnd(node, config.cursor + 1)
    }
  })

ctrl
  .addBinding(config, 'delay', {
    min: 0,
    max: 2,
    step: 0.1,
    label: 'Delay (s)',
  })
  .on('change', () => {
    config.cursor = 0
    ctrl.refresh()
    killType()
    generate()
  })

ctrl.addBinding(config, 'probability', {
  min: 0,
  max: 1,
  step: 0.01,
  label: 'Pause (%)',
})

const interrupt = () => {
  dirty = true
  killType()
  content.setEnd(node, config.cursor)
  cursor.setStart(node, config.cursor)
  cursor.setEnd(node, config.cursor + 1)
  document.documentElement.dataset.paused = true
}

cursorRange.controller.view.element.addEventListener('click', () => {
  interrupt()
})
cursorRange.controller.view.element.addEventListener('keyup', () => {
  interrupt()
})

ctrl.addBinding(config, 'block', {
  label: 'Cursor',
  view: 'color',
})
ctrl.addBinding(config, 'content', {
  label: 'Text',
  view: 'color',
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

ctrl.addButton({ title: 'Restart' }).on('click', () => {
  config.cursor = 0
  ctrl.refresh()
  killType()
  generate()
})

ctrl.on('change', sync)
update()
