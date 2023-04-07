import gsap from 'gsap'

let AUDIO_CONTEXT
let REPORT
let ANALYSER

console.clear()

const CONFIG = {
  fps: 24,
  duration: 0.1,
  fft: 64,
  fftPlaceholder: 4,
  show: false
}

// use for visualization
let inputs = []
const MAIN = document.querySelector('main')

const genInputs = (size) => {
  document.documentElement.style.setProperty('--input-count', size)
  inputs = new Array(size).fill().map(input => {
    const INPUT = document.createElement('input')
    INPUT.type = 'range'
    INPUT.min = 0
    INPUT.max = 100
    INPUT.step = 1
    INPUT.className = 'eq-input'
    INPUT.value = 0
    INPUT.setAttribute('orient', 'vertical')
    MAIN.appendChild(INPUT)
    return INPUT
  })
}

genInputs(CONFIG.fft * 0.5)
gsap.ticker.fps(CONFIG.fps)

const TL = gsap.timeline()

const ANALYSE = stream => {
  AUDIO_CONTEXT = new AudioContext()
  ANALYSER = AUDIO_CONTEXT.createAnalyser()
  ANALYSER.fftSize = CONFIG.fft
  const SOURCE = AUDIO_CONTEXT.createMediaStreamSource(stream)
  const DATA_ARR = new Uint8Array(ANALYSER.frequencyBinCount)
  SOURCE.connect(ANALYSER)
  
  if (!inputs || (inputs.length !== DATA_ARR.length)) genInputs(DATA_ARR.length)
 
  REPORT = () => {
    // Time or Frequency
    // ANALYSER.getByteTimeDomainData(DATA_ARR)
    ANALYSER.getByteFrequencyData(DATA_ARR)
    
    // Again time vs. frequency
    // 0 - 255 === -1 - 1 soooo 128.0 === 0
    // const BARS = [...DATA_ARR].map(value => (1 - (value / 128.0)) * 100)
    const BARS = [...DATA_ARR].map(value => Math.round(gsap.utils.clamp(0, 100, gsap.utils.mapRange(0, 255, -1, 1)(value) * 100)))
    // At this point change the size of nodes
    TL.to(inputs, {
      duration: 0.1,
      value: index => gsap.utils.mapRange(0, 10, 0, 100)(gsap.utils.clamp(0.5, 10, BARS[index])),
      '--accent': index => gsap.utils.mapRange(0, 10, 130, 10)(gsap.utils.clamp(0.5, 10, BARS[index])),
    }, gsap.ticker.frame * (1 / CONFIG.fps))
  }
  gsap.ticker.add(REPORT)
}


const RECORD = async () => {
  const MEDIA_STREAM = await window.navigator.mediaDevices.getUserMedia({
    audio: true
  })
  const RECORDER = new MediaRecorder(MEDIA_STREAM)
  RECORDER.start()
  ANALYSE(RECORDER.stream)
}

RECORD()