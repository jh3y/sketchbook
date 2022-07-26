import Splitting from 'splitting'
import ScrollOut from 'scroll-out'

const randomInRange = (min, max) =>
	Math.floor(
		Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)
	)


Splitting()

ScrollOut({
  targets: '.word',
  scrollingElement: 'ul',
})

// Assign random position for random chars
const RANDOM_CHARS = document.querySelectorAll('.random .char')
RANDOM_CHARS.forEach(char => {
	char.style.setProperty('--x', randomInRange(-1000, 1000))
	char.style.setProperty('--y', randomInRange(-1000, 1000))
})