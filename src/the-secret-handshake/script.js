/** This is a tricky little thing to make.
 * Essentially need to work out rotation steps
 * But also check for deviance on the other axis at the same time
 * */

/**
 * Remember the different rotation axis that are available
 * alpha: around z-axis, flat === 0, 0 -> 360 clockise rotation
 * beta: around x-axis, an upright device is at 90, flat is 0. 180 is laying flat face down. Also get -180 -> 0
 * gamma: around y-axis, -90 is rotating to the left from flat. 90 is rotating to the right from flat.
 * */

const STEPS = [
	{
		axis: 'beta',
		start: 90,
		end: 0,
		completed: false,
	},
	{
		axis: 'alpha',
		start: 359,
		end: 270,
		completed: false,
	},
	{
		axis: 'gamma',
		start: 0,
		end: 80,
		completed: false,
	},
]

/**
 * These steps would simulate
 * 1. Lay your phone flat
 * 2. Rotate it 90 deg to the right
 * 3. Tilt it up on its side
 * */
let currentStep = 0
let active = false
let proximity
let distance
const handleOrientation = e => {
	/**
	 * This is where it gets tricky. We need to focus on the
	 * first step in the STEPS that isn't completed until it is.
	 * But, once we activate, we need to make sure the other axis
	 * don't deviate too much to make sure we are on track.
	 * We could do this by tracking the currentStep and having
	 * a threshold for deviation perhaps.
	 * */
	 const STEP = STEPS[currentStep]
	 if (proximity === undefined) proximity = STEP.start - STEP.end // 90, -270, 80
	 /**
	  * We need some way of knowing if we're in the active state
	  * */
	 if (!active && Math.floor(e[STEP.axis]) === STEP.start) {
	 	active = true
	 	console.info('activated')
	 } else if (active) {
	 	// Work out what's going on here.
	 	const newDistance = STEP.end - (STEP.start - e[STEP.axis])
	 	if (!distance) distance = newDistance
	 	else if (newDistance <= distance) {
	 		distance = newDistance
	 		console.info('keep going')
	 	} else if (newDistance > distance) {
	 		console.info('uh oh reset')
	 		active = false
	 		proximity = distance = undefined
	 	}
	 	else if (newDistance === STEP.end) {
	 		console.info('we have an unlock')
	 	}
	 	console.info(newDistance, STEP.end)
	 }
}

// Need to tie this to a control to start...
if (DeviceOrientationEvent?.requestPermission) {
	DeviceOrientationEvent.requestPermission().then((permission) => {
		if (permission === 'granted')
			window.addEventListener('deviceorientation', handleOrientation)
		else alert('You denied permission to play!')
	})
} else {
	window.addEventListener('deviceorientation', handleOrientation)
}
