import Splitting from 'splitting'
import ScrollOut from 'scroll-out'

const randomInRange = (min, max) =>
	Math.floor(
		Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)
	)

const PANEL_CONTAINER = document.querySelector('ul')
const PANELS = [...document.querySelectorAll('li')].sort((a, b) => {
	if (
		a.innerText === 'Scroll for cascading text effects!' ||
		b.innerText === 'Scroll for cascading text effects!' ||
		a.innerText === "Thanks for scrollin'!" ||
		b.innerText === "Thanks for scrollin'!"
	) {
		return 0
	}
	return Math.random() > 0.5 ? -1 : 1
})
PANEL_CONTAINER.innerHTML = ''
PANELS.forEach((panel) => PANEL_CONTAINER.appendChild(panel))

Splitting()

ScrollOut({
	targets: ['.word', '.falling', '.scrolled', '.glare'],
	scrollingElement: 'ul',
})

// Assign random position for random chars
const RANDOM_CHARS = document.querySelectorAll('.random .char')
RANDOM_CHARS.forEach((char) => {
	char.style.setProperty('--x', randomInRange(-1000, 1000))
	char.style.setProperty('--y', randomInRange(-1000, 1000))
})

// Assign indexes to "Expanding"
const EXPANDING_WORDS = document.querySelectorAll('.expanding .word')
EXPANDING_WORDS.forEach((word, index) => {
	const exp = (index % 2) + 1
	if (index !== 0) {
		word.style.setProperty('--expansion-position', index > 2.5 ? exp : exp * -1)
		word.style.setProperty('--expansion-index', exp)
	}
})


