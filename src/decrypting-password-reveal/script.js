import { gsap } from 'gsap'
import MorphSVGPlugin from 'gsap/MorphSVGPlugin'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrambleTextPlugin, MorphSVGPlugin)

const BLINK_SPEED = 0.075
const TOGGLE_SPEED = 0.125
const ENCRYPT_SPEED = 1

let busy = false

const EYE = document.querySelector('.eye')
const TOGGLE = document.querySelector('button')
const INPUT = document.querySelector('#password')
const PROXY = document.createElement('div')

// 'upperAndLowerCase'
const chars =
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~,.<>?/;":][}{+_)(*&^%$#@!±=-§'

let blinkTl
const BLINK = () => {
  const delay = gsap.utils.random(2, 8)
  const duration = BLINK_SPEED
  const repeat = Math.random() > 0.5 ? 3 : 1
  blinkTl = gsap.timeline({
  	delay,
  	onComplete: () => BLINK(),
  	repeat,
  	yoyo: true,
  })
	  .to('.lid--upper', {
	  	morphSVG: '.lid--lower',
  		duration,
	  })
	  .to('#eye-open path', {
	  	morphSVG: '#eye-closed path',
  		duration,
	  }, 0)
}

BLINK()

const posMapper = gsap.utils.mapRange(-100, 100, 30, -30)
let reset
const MOVE_EYE = ({ x, y }) => {
	if (reset) reset.kill()
	reset = gsap.delayedCall(2, () => {
		gsap.to('.eye', { xPercent: 0, yPercent: 0, duration: 0.2 })
	})
	const BOUNDS = EYE.getBoundingClientRect()
	// Get distance and angle between two points
	gsap.set('.eye', {
		xPercent: gsap.utils.clamp(-30, 30, posMapper(BOUNDS.x - x)),
		yPercent: gsap.utils.clamp(-30, 30, posMapper(BOUNDS.y - y))
	})
}

window.addEventListener('pointermove', MOVE_EYE)

// Trick is to animate from discs and to discs.

TOGGLE.addEventListener('click', () => {
	if (busy) return
	const isText = INPUT.matches('[type=password]')
	const val = INPUT.value
	busy = true
	// Need to stop the blink here and kill it off. 
	TOGGLE.setAttribute('aria-pressed', isText)
	const duration = TOGGLE_SPEED

	if (isText) {
		if (blinkTl) blinkTl.kill()

		gsap.timeline({
			onComplete: () => {
				busy = false
			}
		})
			// Close the eye first and kill the TL
			.to('.lid--upper', {
		  	morphSVG: '.lid--lower',
	  		duration,
		  })
		  .to('#eye-open path', {
		  	morphSVG: '#eye-closed path',
	  		duration,
		  }, 0)
		  // Decrypt the text input
			.to(PROXY, {
				duration: ENCRYPT_SPEED,
				onStart: () => {
					INPUT.type = 'text'
				},
				onComplete: () => {
					PROXY.innerHTML = ''
					INPUT.value = val
				},
				scrambleText: {
					chars,
					text:
						INPUT.value.charAt(INPUT.value.length - 1) === ' '
							? `${INPUT.value.slice(0, INPUT.value.length - 1)}${chars.charAt(
									Math.floor(Math.random() * chars.length)
							  )}`
							: INPUT.value,
				},
				onUpdate: () => {
					const len = val.length - PROXY.innerText.length
					INPUT.value = `${PROXY.innerText}${new Array(len).fill('•').join('')}`
				},
			}, 0)
	} else {
		gsap.timeline({
			onComplete: () => {
				BLINK()
				busy = false
			}
		})
			.to('.lid--upper', {
		  	morphSVG: '.lid--upper',
	  		duration,
		  })
		  .to('#eye-open path', {
		  	morphSVG: '#eye-open path',
	  		duration,
		  }, 0)
			.to(PROXY, {
				duration: ENCRYPT_SPEED,
				onComplete: () => {
					INPUT.type = 'password'
					INPUT.value = val
					PROXY.innerHTML = ''
				},
				scrambleText: {
					chars,
					text: new Array(INPUT.value.length).fill('•').join(''),
				},
				onUpdate: () => {
					INPUT.value = `${PROXY.innerText}${val.slice(
						PROXY.innerText.length,
						val.length
					)}`
				},
			}, 0)
	}
})
