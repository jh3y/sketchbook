import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import * as TweakpaneEssentialsPlugin from 'https://cdn.skypack.dev/@tweakpane/plugin-essentials'

import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'

const config = {
  theme: 'dark',
  device: '',
  width: null,
  height: null,
  sample: 4,
  threshold: 128,
  noise: 0,
  steps: 2,
  debug: false,
}

let devices = []

const input = document.querySelector('#input')
const down = document.querySelector('#downsample')

const DPR = window.devicePixelRatio
const video = document.querySelector('video')
const canvas = document.querySelector('canvas')
const offscreen = document.createElement('canvas')
const offscreenCtx = offscreen.getContext('2d', { willReadFrequently: true })
const ctx = canvas.getContext('2d', { willReadFrequently: true })

let stream
let frame

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})
ctrl.registerPlugin(TweakpaneEssentialsPlugin)

const update = () => {
  input.innerText = `${config.width} / ${config.height}`
  down.innerText = `${Math.floor(config.width / config.sample)} / ${Math.floor(
    config.height / config.sample
  )}`
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.debug = config.debug
}

let snapper

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

const camera = ctrl.addBinding(config, 'device', {
  label: 'Camera',
  options: {},
})
const fps = ctrl.addBlade({
  view: 'fpsgraph',
  label: 'FPS',
  rows: 2,
})
ctrl.addBinding(config, 'sample', {
  label: 'Downsample',
  min: 1,
  max: 20,
  step: 1,
})

ctrl.addBinding(config, 'threshold', {
  min: 0,
  max: 255,
  step: 1,
  label: 'Threshold',
})
ctrl.addBinding(config, 'noise', {
  min: 0,
  max: 100,
  step: 1,
  label: 'Noise (%)',
})
ctrl.addBinding(config, 'steps', {
  min: 2,
  max: 10,
  step: 1,
  label: 'Steps',
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

const applyAtkinsonDithering = (imageData, threshold, noiseAmount, steps) => {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height

  // Create grayscale palette based on steps
  const grayscalePalette = Array.from({ length: steps }, (_, i) =>
    Math.round((i * 255) / (steps - 1))
  )

  // Create a mapping function to find the closest palette color
  const findClosestPaletteColor = (value) => {
    return grayscalePalette.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    )
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3

      // Apply noise to the pixel value
      const noise = (Math.random() - 0.5) * 2 * noiseAmount * 255
      const adjustedValue = Math.max(0, Math.min(255, avg + noise))

      // Apply threshold and find closest palette color
      const thresholdedValue = adjustedValue > threshold ? 255 : 0
      const newPixel = findClosestPaletteColor(thresholdedValue)

      const error = adjustedValue - newPixel

      data[i] = data[i + 1] = data[i + 2] = newPixel

      const offsets = [
        [1, 0, 1 / 8],
        [2, 0, 1 / 8],
        [-1, 1, 1 / 8],
        [0, 1, 1 / 8],
        [1, 1, 1 / 8],
        [0, 2, 1 / 8],
      ]

      for (const [dx, dy, factor] of offsets) {
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const ni = (ny * width + nx) * 4
          const newError = error * factor
          data[ni] = Math.min(255, Math.max(0, data[ni] + newError))
          data[ni + 1] = Math.min(255, Math.max(0, data[ni + 1] + newError))
          data[ni + 2] = Math.min(255, Math.max(0, data[ni + 2] + newError))
        }
      }
    }
  }

  return imageData
}

const updateCanvas = () => {
  fps.begin()
  const downsampled = {
    width: Math.floor(video.videoWidth / config.sample),
    height: Math.floor(video.videoHeight / config.sample),
  }

  offscreen.width = canvas.width = downsampled.width * DPR
  offscreen.height = canvas.height = downsampled.height * DPR

  offscreenCtx.drawImage(
    video,
    0,
    0,
    downsampled.width * DPR,
    downsampled.height * DPR
  )

  const imageData = offscreenCtx.getImageData(
    0,
    0,
    downsampled.width * DPR,
    downsampled.height * DPR
  )

  const atkinsonDithered = applyAtkinsonDithering(
    imageData,
    config.threshold,
    config.noise / 100,
    config.steps
  )

  offscreenCtx.putImageData(atkinsonDithered, 0, 0)

  ctx.clearRect(0, 0, canvas.width * DPR, canvas.height * DPR)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(
    offscreen,
    0,
    0,
    downsampled.width * DPR,
    downsampled.height * DPR,
    0,
    0,
    canvas.width,
    canvas.height
  )
  fps.end()
}

let capturing = false
const handleCapture = async () => {
  if (!capturing) {
    capturing = true
    snapper.disabled = false
    document.documentElement.dataset.capturing = capturing
    camera.disabled = true
    cap.title = 'Stop'
    stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: config.device ? { exact: config.device } : undefined },
    })
    video.srcObject = stream
    await video.play()
    config.width = video.videoWidth
    config.height = video.videoHeight
    update()
    if (!config.device) getDevices()
    gsap.ticker.add(updateCanvas)
  } else {
    camera.disabled = false
    snapper.disabled = true
    capturing = false
    document.documentElement.dataset.capturing = capturing
    cap.title = 'Capture'
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      stream = null
    }
    ctx.clearRect(0, 0, canvas.width * DPR, canvas.height * DPR)
    gsap.ticker.remove(updateCanvas)
    video.srcObject = null
    if (frame) cancelAnimationFrame(frame)
    config.width = config.height = null
  }
}

const cap = ctrl
  .addButton({
    title: 'Capture',
  })
  .on('click', handleCapture)

ctrl.on('change', sync)
update()

const getDevices = async () => {
  try {
    const available = await navigator.mediaDevices.enumerateDevices()
    devices = available.filter((device) => device.kind === 'videoinput')
    if (devices.length > 0 && !config.device) {
      config.device = devices[0].deviceId
      const changed = []
      for (const device of devices) {
        changed.push({
          text: device.label,
          value: device.deviceId,
        })
      }
      camera.options = changed
      ctrl.refresh()
    }
  } catch (err) {
    console.error('Error enumerating devices:', err)
  }
}

getDevices()
navigator.mediaDevices.addEventListener('devicechange', getDevices)

function snapshot(filename = 'dither-snap.png') {
  // Check if the canvas exists
  if (!canvas) {
    console.error(`No Canvas`)
    return
  }

  // Convert the canvas content to a data URL
  const image = canvas.toDataURL('image/png')

  // Create an anchor element
  const link = document.createElement('a')
  link.href = image
  link.download = 'dither-snap.png'

  // Programmatically click the anchor to trigger the download
  link.click()

  link.remove()
}

snapper = ctrl
  .addButton({ title: 'Snapshot', disabled: true })
  .on('click', snapshot)
