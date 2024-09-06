import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'

const config = {
  theme: 'system',
  font: 20,
  ascii: '@#S%?*+;:,.',
  device: '',
  width: null,
  height: null,
  sample: 1,
  debug: false,
  color: false,
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

const update = () => {
  input.innerText = `${config.width} / ${config.height}`
  down.innerText = `${Math.floor(config.width / config.sample)} / ${Math.floor(
    config.height / config.sample
  )}`
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.debug = config.debug
}

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

ctrl.addBinding(config, 'sample', {
  label: 'Downsample',
  min: 1,
  max: 20,
  step: 1,
})
ctrl.addBinding(config, 'font', {
  label: 'Font Size',
  min: 1,
  max: 50,
  step: 1,
})
ctrl.addBinding(config, 'ascii', {
  label: 'Characters',
})
ctrl.addBinding(config, 'color', {
  label: 'Color',
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

const renderAscii = (ctx, imageData) => {
  const cellWidth = config.font * DPR
  const cellHeight = config.font * DPR
  const numCols = Math.floor(imageData.width / cellWidth)
  const numRows = Math.floor(imageData.height / cellHeight)

  ctx.font = `${config.font * DPR}px monospace`

  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      const posX = x * cellWidth
      const posY = y * cellHeight

      let totalBrightness = 0
      let totalRed = 0
      let totalGreen = 0
      let totalBlue = 0
      let sampleCount = 0

      for (let sy = 0; sy < cellHeight; sy++) {
        for (let sx = 0; sx < cellWidth; sx++) {
          const sampleX = posX + sx
          const sampleY = posY + sy
          const offset = (sampleY * imageData.width + sampleX) * 4
          const red = imageData.data[offset]
          const green = imageData.data[offset + 1]
          const blue = imageData.data[offset + 2]
          const brightness = (red + green + blue) / 3
          totalBrightness += brightness
          totalRed += red
          totalGreen += green
          totalBlue += blue
          sampleCount++
        }
      }

      const averageBrightness = totalBrightness / sampleCount
      const averageRed = totalRed / sampleCount
      const averageGreen = totalGreen / sampleCount
      const averageBlue = totalBlue / sampleCount

      const charIndex = Math.floor(
        (averageBrightness / 256) * config.ascii.length
      )
      const char = config.ascii[charIndex] || ' '
      ctx.fillStyle = config.color
        ? `rgb(${averageRed}, ${averageGreen}, ${averageBlue})`
        : 'canvasText'
      ctx.fillText(char, posX, posY + cellHeight)
    }
  }
}

const updateCanvas = () => {
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

  renderAscii(
    ctx,
    offscreenCtx.getImageData(
      0,
      0,
      downsampled.width * DPR,
      downsampled.height * DPR
    )
  )
}

let capturing = false
const handleCapture = async () => {
  if (!capturing) {
    capturing = true
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
