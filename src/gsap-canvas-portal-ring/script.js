import { gsap } from 'gsap'

console.clear()

const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')

CANVAS.height = window.innerHeight
CANVAS.width = window.innerWidth

// Points round a circle...
/**
 * x: radius * Math.cos(angle ( / 180 ?))
 * y: radius * Math.sin(angle ( / 180 ?))
 * */
const COUNT = 360
const RADIUS = 100

const genSparks = index => {
	const COUNT = gsap.utils.random(1, 10, 1)
	return new Array(COUNT).fill().map(spark => {
		// Base the angle on 0 so upwards would be 270 
		const angle = gsap.utils.random(235, 290) + index
		const travel = gsap.utils.random(50, 150)
		return {
			travel,
			x: 0,
			y: 0,
			size: gsap.utils.random(2, 8),
			glow: `
				${gsap.utils.random(15, 45)}
				${gsap.utils.random(70, 100)}%
				${gsap.utils.random(55, 95)}%
			`,
			// Given angle and radius, you know destinationX/Y,
			destinationX: travel * Math.cos(angle * Math.PI / 180),
			destinationY: travel * Math.sin(angle * Math.PI / 180),
			alpha: 1,
			speed: gsap.utils.random(0.1, 1),
		}
	})
}

const SPOTS = new Array(COUNT).fill().map((point, index) => {
	return {
		originX: RADIUS * Math.cos(index * Math.PI / 180),
		originY: RADIUS * Math.sin(index * Math.PI / 180),
		sparks: genSparks(index),
		active: Math.random() > 0.5,
	}
})

window.__SPOTS = SPOTS
// Work out velocity ranges based on current position.
// So say it's between -15 and 15. Then plus the current index.

// How to get velocity x and y? Get the point from the angle
// and distance. Then use this to calculate the velocity. Even better
// Given point and angle. Just throw in the destination based on
// current position...

gsap.ticker.add(() => {
	CONTEXT.clearRect(0, 0, window.innerWidth, window.innerHeight)
	const CENTER = {
		x: window.innerWidth * 0.5,
		y: window.innerHeight * 0.5
	}
	SPOTS.forEach(({originX, originY, sparks, active}) => {
		if (active) {
			sparks.forEach(spark => {
				CONTEXT.fillStyle = `hsl(${spark.glow} / ${spark.alpha})`
				CONTEXT.fillRect(
					CENTER.x + originX + spark.x,
					CENTER.y + originY + spark.y,
					spark.size,
					spark.size
				)
			})
		}
	})

})

SPOTS.forEach(({ sparks }, index) => {
	sparks.forEach((spark) => {
		gsap.timeline({
			repeat: -1
		})
			.to(spark, {
				x: spark.destinationX,
				y: spark.destinationY,
				duration: spark.speed,
			})
			.to(spark, {
				alpha: 0,
				duration: spark.speed * 0.1,
			}, `>-${spark.speed * 0.1}`)

	})
})

window.addEventListener('resize', () => {
	CANVAS.width = window.innerWidth
	CANVAS.height = window.innerHeight
})

gsap.ticker.fps(60)