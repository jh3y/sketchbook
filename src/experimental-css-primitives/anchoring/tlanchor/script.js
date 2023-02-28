import "./style.css"
import { v4 as uuidv4 } from 'uuid';
import gsap from 'gsap'
import {Pane} from 'tweakpane'
import "../../../../net/experimental-web-platform/script.js";

gsap.registerPlugin(Draggable)

const ANNOTATIONS = document.querySelector('.annotations')
const CONTAINER = document.querySelector('.container')

const CONFIGURATOR = new Pane({
  title: 'TLAnchor – Anchors',
  expanded: true
})

const ANCHOR_ELEMENTS = []

const DELETE_ANCHOR = id => event => {
  if (confirm('Remove anchor?')) {
    const REMOVING = ANCHOR_ELEMENTS.find(anchor => anchor.id === id)
    for (const ANCHOR of ANCHOR_ELEMENTS) {
      // Remove that annotation at the same time
      // This happens if you remove something being anchored to
      if (ANCHOR.options.anchor === REMOVING.id) ANCHOR.annotation.remove()
    }
    if (REMOVING.annotation) REMOVING.annotation.remove()
    REMOVING.pane.dispose()
    REMOVING.element.remove()
    ANCHOR_ELEMENTS.splice(ANCHOR_ELEMENTS.findIndex(anchor => anchor.id === id), 1)
    // Need to iterate through the options and change here.
    SYNC_ANCHOR_OPTIONS()
  }
}

const SYNC_ANCHOR_OPTIONS = () => {
  for (const ANCHOR of ANCHOR_ELEMENTS) {
    if (ANCHOR.anchorOptions) {
      ANCHOR.anchorOptions.dispose()
      ANCHOR.remove.dispose()
    }
    ANCHOR.anchorOptions = ANCHOR.pane.addInput(ANCHOR.options, 'anchor', {
      label: 'Anchor',
      options: getOptions()
    })
    ANCHOR.remove = ANCHOR.pane.addButton({
      title: 'Remove'
    })
    ANCHOR.remove.element.querySelector('button').classList.add('remove-button')
    ANCHOR.remove.on('click', DELETE_ANCHOR(ANCHOR.id))
  }
}


const getOptions = () => {
  const options = {
    'None': ''
  }
  for (const ANCHOR of ANCHOR_ELEMENTS) {
    options[ANCHOR.options.name] = ANCHOR.id
  }
  return options
}

const ADD_ANCHOR = () => {
  // Add new element to the document
  const ANCHOR = {}
  ANCHOR.id = uuidv4()
  const ANCHOR_TEXT = String.fromCharCode(65 + ANCHOR_ELEMENTS.length)
  ANCHOR.options = {
    name: `Anchor ${ANCHOR_TEXT} (${ANCHOR.id})`,
    background: '#F3E779',
    line: window.matchMedia('(prefers-color-scheme: dark)') ? '#FFFFFF' : '#000000',
    anchor: '',
    text: ANCHOR_TEXT,
    debug: false,
  }
  ANCHOR.element = Object.assign(document.createElement('div'), {
    className: 'anchor',
    id: ANCHOR.id,
    innerHTML: ANCHOR_TEXT,
    style: `
      --bg: ${ANCHOR.options.background};
      --anchor-name: --${ANCHOR.id};
      --x: ${gsap.utils.random(window.innerWidth * 0.2, window.innerWidth * 0.8)}px;
      --y: ${gsap.utils.random(window.innerHeight * 0.2, window.innerHeight * 0.8)}px;`,
  })
  
  // Append it and make it Draggable
  CONTAINER.appendChild(ANCHOR.element)
  ANCHOR.element.addEventListener('animationend', () => {
    Draggable.create(ANCHOR.element, { type: 'left,top', allowContextMenu: true })
  })

  // Create the folder pane for it
  ANCHOR.pane = CONFIGURATOR.addFolder({
    title: ANCHOR.options.name,
    expanded: true,
  })
  
  ANCHOR.pane.addInput(ANCHOR.options, 'name', {
    label: 'Label'
  })

  ANCHOR.pane.addInput(ANCHOR.options, 'text', {
    label: 'Content'
  })

  ANCHOR.pane.addInput(ANCHOR.options, 'debug', {
    label: 'Debug'
  })

  ANCHOR.pane.addInput(ANCHOR.options, 'background', {
    label: 'Color',
  })
  
  ANCHOR.pane.addInput(ANCHOR.options, 'line', {
    label: 'Line',
  })

  // At this point, all the panes need updating though.
  ANCHOR_ELEMENTS.push(ANCHOR)
  
  SYNC_ANCHOR_OPTIONS()

  ANCHOR.pane.on('change', event => {
    ANCHOR.pane.title = ANCHOR.options.name
    ANCHOR.element.style.setProperty('--bg', ANCHOR.options.background)
    ANCHOR.element.innerHTML = ANCHOR.options.text
    // Set the anchor positioning..
    if (ANCHOR.annotation) ANCHOR.annotation.remove()
    if (ANCHOR.options.anchor !== '' && ANCHOR.options.anchor !== ANCHOR.id) {
      ANCHOR.annotation = Object.assign(document.createElement('div'), {
        className: 'annotation',
        innerHTML: '<div></div><div></div><div></div><div></div>',
        style: `
          --debug: ${ANCHOR.options.debug ? 1 : 0};
          --anchor-one: --${ANCHOR.id};
          --anchor-two: --${ANCHOR.options.anchor};
          --line: ${ANCHOR.options.line}
        `,
      })
      ANCHOR.annotation.dataset.for = ANCHOR.id
      ANNOTATIONS.appendChild(ANCHOR.annotation)
    }

  })
  

  // Add a new pane for it and sync the values with factory stuff
}

const ADD = CONFIGURATOR.addButton({
  title: 'Add Anchor',
})
ADD.element.querySelector('button').classList.add('add-button')
ADD.on('click', ADD_ANCHOR)