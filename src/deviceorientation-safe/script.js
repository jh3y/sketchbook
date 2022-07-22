import confetti from 'canvas-confetti'

const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function() {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const PROXIMITY_THRESHOLD = 20
const ALPHA_MAPPER = mapRange(0, 360, 0, 100)
const BETA_MAPPER = mapRange(-180, 180, 0, 100)
const GAMMA_MAPPER = mapRange(-90, 90, 0, 100)
const PROXIMITY_MAPPER = mapRange(0, PROXIMITY_THRESHOLD, 100, 0)

const ALPHA = document.querySelector('#alpha') // Z-axis (0deg - 360deg)
const ALPHA_LABEL = document.querySelector('[for="alpha"]') // Z-axis (0deg - 360deg)
const BETA = document.querySelector('#beta') // X-axis (-180deg - 180deg)
const BETA_LABEL = document.querySelector('[for="beta"]') // X-axis (-180deg - 180deg)
const GAMMA = document.querySelector('#gamma') // Y-axis (-90deg - 90deg)
const GAMMA_LABEL = document.querySelector('[for="gamma"]') // Y-axis (-90deg - 90deg)
const BUTTON = document.querySelector('button')
const TITLE = document.querySelector('h1')

const GET_RANDOM = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const COMBINATIONS = [
	{
		id: 'alpha',
		unlock: GET_RANDOM(0, 100),
		input: ALPHA,
		label: ALPHA_LABEL,
		mapper: ALPHA_MAPPER,
	},
	{
		id: 'beta',
		unlock: GET_RANDOM(0, 100),
		input: BETA,
		label: BETA_LABEL,
		mapper: BETA_MAPPER,
	},
	{
		id: 'gamma',
		unlock: GET_RANDOM(0, 100),
		input: GAMMA,
		label: GAMMA_LABEL,
		mapper: GAMMA_MAPPER,
	},
]
const SAFE = document.querySelector('.safe')
const MARQUEE = document.querySelector('marquee')
const SHADOW = document.querySelector('.safe__shadow')
let step = 0
let vibrating = false


const LOCKS = document.querySelector('.locks')
LOCKS.style.setProperty('--locks', COMBINATIONS.length)
// Create lock animations
COMBINATIONS.forEach((combo, index) => {
	const LOCK = document.createElement('div')
	LOCK.className = 'lock lock--locked'
	LOCK.style.setProperty('--index', index)
	LOCKS.appendChild(LOCK)
})


const sides = 30
// 50% of 0.9 * size
const radius = 20 * 0.8 * 0.3 * 0.5
const INNER_ANGLE = (((sides - 2) * 180) / sides) * 0.5
SAFE.style.setProperty('--side', 2 * radius * Math.cos(INNER_ANGLE * (Math.PI / 180)))
SAFE.style.setProperty('--sides', sides)
SAFE.style.setProperty('--radius', radius)

const AUDIO = {
	SUCCESS: new Audio(new URL('./grunt-party--optimised.mp3', import.meta.url)),
	TWIST: new Audio(new URL('./vault-twist--notch.mp3', import.meta.url)),
	SLAM: new Audio(new URL('./anvil.mp3', import.meta.url))
}

AUDIO.TWIST.volume = 0.5

const openSafe = () => {
	SAFE.classList.remove('safe--cracking')
	SAFE.classList.remove('safe--cracked')
	SAFE.classList.add('safe--opened')
	confetti()
	AUDIO.SUCCESS.play()
	SAFE.removeEventListener('transitionend', openSafe)
}

let playing = false
const handleOrientation = e => {
	const { alpha, beta, gamma } = e

	// Set the value of the step input
	const { input, id, label, mapper, unlock } = COMBINATIONS[step]
	input.value = mapper(e[id])
	if (!playing) {
		playing = true
		AUDIO.TWIST.pause()
		AUDIO.TWIST.currentTime = 0
		AUDIO.TWIST.play()
		setTimeout(() => {
			playing = false
		}, 100)
	}
	
	SAFE.style.setProperty('--combo', input.value)
	
	// Let's also signal it to user how close they are to the value
	const proximity = PROXIMITY_MAPPER(Math.min(Math.max(0, Math.abs(input.value - unlock)), PROXIMITY_THRESHOLD))
	SAFE.style.setProperty('--proximity', proximity)
	if (((100 - proximity) <= 10) && !vibrating) {
		vibrating = true
		window.navigator.vibrate(200)
		setTimeout(() => {
			window.navigator.vibrate(0)
			vibrating = false
		}, 200)
	} else {
		document.body.removeAttribute('style')
	}

	if (parseInt(input.value, 10) === unlock && LOCKS.children[step]) {
		LOCKS.children[step].classList.remove('lock--locked')
		LOCKS.children[step].classList.add('lock--unlocked')
		step += 1
		if (step === COMBINATIONS.length) {
			SAFE.style.setProperty('--proximity', 0)
			// MARQUEE.style.display = 'block'
			SAFE.classList.add('safe--cracked')
			SAFE.addEventListener('transitionend', openSafe)
			window.removeEventListener('deviceorientation', handleOrientation)
		}
	}
}



/**
 * Cater for iOS being "fussy" by adding a button to kick things off h/t @Vanaf1979
 * */
const getCracking = () => {
	[...LOCKS.children].forEach(lock => lock.style.display = 'block')
	SAFE.classList.add('safe--cracking')
	SAFE.removeEventListener('transitionend', getCracking)
}
const START = () => {
	BUTTON.remove()
	navigator.vibrate([1000])
	AUDIO.SLAM.currentTime = 0
	AUDIO.SLAM.play()
	SAFE.addEventListener('transitionend', getCracking)
	SAFE.style.setProperty('--flight', 0)
	SHADOW.style.setProperty('--o', 1)
	if (DeviceOrientationEvent?.requestPermission) {
		DeviceOrientationEvent.requestPermission().then(permission => {
			if (permission === 'granted') window.addEventListener('deviceorientation', handleOrientation)
			else alert('You denied permission to play!')
		})
	} else {
		window.addEventListener('deviceorientation', handleOrientation)
	}
}

BUTTON.addEventListener('click', START)