// import { GUI } from 'dat.gui'

// const CONFIG = {
//   'rotation-x': -24,
//   'rotation-y': -32,
//   open: false,
// }

// const UPDATE = () => Object.keys(CONFIG).forEach(key => {
//   if (key === 'open') {
//     document.documentElement.style.setProperty('--open', CONFIG.open ? 1 : 0)
//   } else {
//     document.documentElement.style.setProperty(`--${key}`, CONFIG[key])
//   }
// })

// const CTRL = new GUI()
// const SCENE = CTRL.addFolder('Scene Rotation (deg)')

// SCENE.add(CONFIG, 'rotation-x', -180, 180, 1).name('X').onChange(UPDATE)
// SCENE.add(CONFIG, 'rotation-y', -180, 180, 1).name('Y').onChange(UPDATE)
// SCENE.add(CONFIG, 'open').name('Open').onChange(UPDATE)

// UPDATE()