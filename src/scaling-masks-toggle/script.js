import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const CONFIG = {
  startX: 0, 
  startY: 0,
  startSize: 50,
  endX: -5, 
  endY: -5,
  endSize: 100,
  state: 'Start',
}

const CTRL = new GUI()

const BOX = document.querySelector('.box')

const update = () => {
  BOX.style.setProperty('--start-x', BOX.offsetWidth * (CONFIG.startX / 100))
  BOX.style.setProperty('--start-y', BOX.offsetWidth * (CONFIG.startY / 100))
  BOX.style.setProperty('--start-size', BOX.offsetWidth * (CONFIG.startSize / 100))
  BOX.style.setProperty('--end-x', BOX.offsetWidth * (CONFIG.endX / 100))
  BOX.style.setProperty('--end-y', BOX.offsetWidth * (CONFIG.endY / 100))
  BOX.style.setProperty('--end-size', BOX.offsetWidth * (CONFIG.endSize / 100))
  BOX.dataset.position = CONFIG.state
}

const START = CTRL.addFolder("Start")
START.add(CONFIG, 'startX', -100, 100, 1).name('Position X (%)').onChange(update)
START.add(CONFIG, 'startY', -100, 100, 1).name('Position Y (%)').onChange(update)
START.add(CONFIG, 'startSize', 0, 300, 1).name('Size (%)').onChange(update)
const END = CTRL.addFolder("End")
END.add(CONFIG, 'endX', -100, 100, 1).name('Position X (%)').onChange(update)
END.add(CONFIG, 'endY', -100, 100, 1).name('Position Y (%)').onChange(update)
END.add(CONFIG, 'endSize', 0, 300, 1).name('Size (%)').onChange(update)
CTRL.add(CONFIG, 'state', ['Start', 'End']).name('Position').onChange(update)

update()