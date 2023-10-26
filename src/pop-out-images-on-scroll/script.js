import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const CONFIG = {
  explode: false
}

const CTRL = new GUI()

const TOGGLE = () => {
  document.body.toggleAttribute('data-exploded')
}

CTRL.add(CONFIG, 'explode').name('Explode?').onChange(TOGGLE)