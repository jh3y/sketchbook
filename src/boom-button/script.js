import gsap from 'gsap'

const BUTTON = document.querySelector('button')
const AUDIO = new Audio('./baby-dont-hurt-me.mp3')

const CONFIG = {
  FADE: 2,
  BARS: 16,
  DURATION: 0.6,
  ANGLE: -22,
  MULTI: 2.6,
  FFT: 32,
}
// Stuff for audio...
// Load MP3 file
// Create audio context and analyser node
let AUDIO_CONTEXT
let SOURCE
let ANALYSER
// Min number of bars you can get is 16. If you want less, like 4, take the average of groups of 4.
// Or only use the first 4 or 5.
// ANALYSER.fftSize = CONFIG.FFT;
// // Connect audio source to analyser
// SOURCE.connect(ANALYSER);
// ANALYSER.connect(AUDIO_CONTEXT.destination);
// Create array to hold frequency data
let BUFFER_LENGTH
let FREQ_ARR
let TIME_ARR

// Create canvas element and context
const canvas = document.querySelector('.eq')
const canvasContext = canvas.getContext('2d')

let grd
let barWidth
let barHeightMultiplier
let VIZ_TL
let run = 0

const TRACK = []
const BOUNDS = BUTTON.getBoundingClientRect()

gsap.defaults = {
  ease: 'power4.out',
}

gsap.set(BUTTON, { '--boom-depth': 0 })
gsap.set('.play-btn__box', { display: 'block' })

const COG_PLAY = gsap
  .timeline({
    paused: true,
  })
  .to('.cog', {
    rotate: 360,
    repeat: -1,
    ease: 'none',
    duration: 3,
  })

BUTTON.addEventListener('click', () => {
  BUTTON.disabled = true

  gsap
    .timeline({
      onComplete: () => {
        if (!AUDIO_CONTEXT) {
          AUDIO_CONTEXT = new AudioContext()
          SOURCE = AUDIO_CONTEXT.createMediaElementSource(AUDIO)
          ANALYSER = AUDIO_CONTEXT.createAnalyser()
          // Min number of bars you can get is 16. If you want less, like 4, take the average of groups of 4.
          // Or only use the first 4 or 5.
          ANALYSER.fftSize = CONFIG.FFT
          // Connect audio source to analyser
          SOURCE.connect(ANALYSER)
          ANALYSER.connect(AUDIO_CONTEXT.destination)
          // Create array to hold frequency data
          BUFFER_LENGTH = ANALYSER.frequencyBinCount
          FREQ_ARR = new Uint8Array(BUFFER_LENGTH)
          TIME_ARR = new Uint8Array(BUFFER_LENGTH)
        }
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        barWidth = canvas.width / CONFIG.BARS
        barHeightMultiplier = canvas.height / 255
        grd = canvasContext.createLinearGradient(0, 0, 0, canvas.height)
        grd.addColorStop(0, 'red')
        grd.addColorStop(1 / 3, 'red')
        grd.addColorStop(1 / 3, 'yellow')
        grd.addColorStop(2 / 3, 'yellow')
        grd.addColorStop(2 / 3, 'green')
        grd.addColorStop(1, 'green')
        canvasContext.fillStyle = grd
        AUDIO.pause()
        AUDIO.currentTime = 0
        AUDIO.volume = 0
        AUDIO.play()
        COG_PLAY.play()
      },
    })
    .set('.btn-jump', {
      rotateY: 0,
    })
    .set('.front', {
      clearProps: 'background'
    })
    .set('.btn-shadow', {
      opacity: 0,
    })
    .to(
      '.btn-scene',
      {
        transform: `rotateX(${CONFIG.ANGLE}deg) rotateY(${CONFIG.ANGLE}deg)`,
        duration: CONFIG.DURATION,
        '--active': 1,
      },
      0
    )
    .to(
      '.play-btn__text',
      {
        opacity: 0,
        duration: CONFIG.DURATION,
        z: BOUNDS.width * CONFIG.MULTI * 0.125,
      },
      0
    )
    .to(
      '.cassette-deck',
      {
        rotateX: -45,
        duration: CONFIG.DURATION,
      },
      0
    )
    .to(
      BUTTON,
      {
        duration: CONFIG.DURATION,
        '--boom-depth': BOUNDS.width * CONFIG.MULTI * 0.25,
        width: BOUNDS.width * CONFIG.MULTI,
        height: BOUNDS.width * CONFIG.MULTI * 0.56,
      },
      0
    )
    .to(
      '.btn-shadow',
      {
        opacity: 1,
        duration: CONFIG.DURATION * 0.5,
        ease: 'bounce.out',
      },
      CONFIG.DURATION * 0.5
    )
    .to(
      '.btn-jump',
      {
        duration: CONFIG.DURATION * 0.5,
        y: -200,
      },
      0
    )
    .to(
      '.btn-jump',
      {
        duration: CONFIG.DURATION * 0.5,
        ease: 'bounce.out',
        y: 0,
      },
      CONFIG.DURATION * 0.5
    )
    .to(
      '.btn-jump',
      {
        duration: CONFIG.DURATION * 0.5,
        rotateY: -360,
      },
      0
    )
    .to(
      '.feature',
      {
        opacity: 1,
        duration: CONFIG.DURATION * 0.5,
      },
      0
    )
    .to('.handle', {
      delay: 0.5,
      rotateX: -90,
      duration: CONFIG.DURATION * 0.5
    })
    .to('.cassette-deck', {
      rotateX: 0,
      duration: CONFIG.DURATION * 0.5
    })
    .to('.play', {
      delay: CONFIG.DURATION * 0.25,
      z: -5,
      duration: CONFIG.DURATION * 0.25
    })
})

const VIZ = () => {
  // Generate the first time then reuse
  // Get frequency data
  ANALYSER.getByteFrequencyData(FREQ_ARR)
  ANALYSER.getByteTimeDomainData(TIME_ARR)
  // Clear canvas
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)

  const BARS = FREQ_ARR.slice(0, CONFIG.BARS)

  // Keep the Array in memory so we don't have to create it again.
  // TRACK.push(BARS)

  BARS.forEach((bar, index) => {
    // let barHeight = gsap.utils.snap(255 / 10, BARS[index] * barHeightMultiplier);
    let barHeight = gsap.utils.snap(255 / 25, BARS[index] * barHeightMultiplier)
    // But, I actually want to step this so it's gonna be the nearest divisor of 5.
    // console.info({ barHeight })
    gsap.set('.tweeter', {
      scale: gsap.utils.mapRange(128, 255, 1, 1.35)(TIME_ARR[0]),
    })
    canvasContext.fillRect(
      index * barWidth,
      canvas.height - barHeight,
      barWidth,
      barHeight
    )
  })
}

VIZ_TL = gsap.timeline()
const FADE_IN_OUT = () => {
  gsap.to(AUDIO, {
    volume: 1,
    duration: CONFIG.FADE,
    repeat: 1,
    yoyo: true,
    repeatDelay: AUDIO.duration - 2 * CONFIG.FADE,
  })
  run = 0
  gsap.ticker.add(VIZ)
}

const RESET = () => {
  // Can it remove it if it isn't there?
  gsap.delayedCall(CONFIG.FADE * 0.5, () => {
    gsap.ticker.remove(VIZ)
    COG_PLAY.pause()
    gsap
      .timeline({
        onComplete: () => {
          BUTTON.disabled = false
        },
      })
      .set(
        '.btn-shadow',
        {
          opacity: 0,
        },
      )
      .to('.play', {
        z: 0,
        duration: CONFIG.DURATION * 0.25,
      })
      .to('.handle', {
        rotateX: 0,
        duration: CONFIG.DURATION * 0.25,
      })
      .to(BUTTON, {
        duration: CONFIG.DURATION * 0.5,
        width: BOUNDS.width,
        height: BOUNDS.height,
      })
      .to('.btn-scene', {
        '--active': 0,
        duration: CONFIG.DURATION * 0.25,
      }, '<')
      .to(
        '.btn-scene',
        {
          duration: CONFIG.DURATION * 0.5,
          transform: 'rotateX(0deg) rotateY(0deg)',
        },
        '<'
      )
      .to(
        '.feature',
        {
          opacity: 0,
          duration: CONFIG.DURATION * 0.15,
        },
        '<'
      )
      .to(
        '.btn-jump',
        {
          rotateY: 0,
          duration: CONFIG.DURATION * 0.5,
        },
        '<'
      )
      .to(
        '.front',
        {
          background: 'var(--front)',
          duration: CONFIG.DURATION * 0.25,
        },
        '<'
      )
      .to(BUTTON, {
        '--boom-depth': 0,
        duration: CONFIG.DURATION * 0.25,
      })
      .to('.play-btn__text', {
        opacity: 1,
        z: 0,
        duration: CONFIG.DURATION * 0.25,
      }, '<')
      .timeScale(1)
  })
}

// Bind things up
AUDIO.addEventListener('play', FADE_IN_OUT)
AUDIO.addEventListener('ended', RESET)
