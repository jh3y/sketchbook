import gsap from 'gsap'

let inputs = []

const EQ = document.querySelector('.eq')
const HUE_MAPPER = gsap.utils.mapRange(0, 100, 130, 10)

const CONFIG = {
  fps: 60,
  duration: 0.1,
  fft: 32,
  fftPlaceholder: 4,
  show: false,
}

const genInputs = (size) => {
  inputs = new Array(size).fill().map(input => {
    const BAR = Object.assign(document.createElement('div'), {
      className: 'bar'
    })
    const INPUT = Object.assign(document.createElement('input'), {
      type: 'range',
      min: 0,
      max: 100,
      step: 1,
      value: 0,
    })
    BAR.appendChild(INPUT)
    EQ.appendChild(BAR)
    return INPUT
  })
}

genInputs(CONFIG.fft * 0.5)
gsap.ticker.fps(CONFIG.fps)

const TL = gsap.timeline()

// const UPDATE = () => {
//   inputs.forEach(input => {
//     const value = gsap.utils.random(0, 100)
//     gsap.to(input, {
//       value,
//       '--hue': HUE_MAPPER(value)
//     })
//   })
// }

// gsap.ticker.add(UPDATE)


const ANALYSE = stream => {
  const AUDIO_CONTEXT = new AudioContext()
  const ANALYSER = AUDIO_CONTEXT.createAnalyser()
  ANALYSER.fftSize = CONFIG.fft
  const SOURCE = AUDIO_CONTEXT.createMediaStreamSource(stream)
  const DATA_ARR = new Uint8Array(ANALYSER.frequencyBinCount)
  SOURCE.connect(ANALYSER)

  const UPDATE = () => {
    ANALYSER.getByteFrequencyData(DATA_ARR)
    // ANALYSER.getByteTimeDomainData(DATA_ARR)
    const BARS = [...DATA_ARR].map(freq => {
      // const pre = gsap.utils.mapRange(0, 10, 0, 255)((1 - (freq / 128.0)) * 100)
      const value = gsap.utils.mapRange(0, 255, 0, 100)(freq)
      return {
        value,
        hue: gsap.utils.clamp(10, 130, HUE_MAPPER(value))
      }
    })
    TL.to(inputs, {
      value: index => BARS[index].value,
      '--hue': index => BARS[index].hue,
      duration: 0.1,
    }, gsap.ticker.frame * (1 / CONFIG.fps))

  }

  gsap.ticker.add(UPDATE)
}

const START = async () => {
  const MEDIA_STREAM = await window.navigator.mediaDevices.getUserMedia({
    audio: true,
  })
  ANALYSE(MEDIA_STREAM)
}

START()