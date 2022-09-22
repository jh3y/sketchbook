import "../../../../net/experimental-web-platform/script.js";

const ADDER = document.querySelector('[data-addpopup]')
const BACKDROP_ATTRIBUTE = 'data-hasbackdrop'

let popUps = []

const randomInRange = (min, max) =>
	Math.floor(
		Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)
	)

const destroyPopUp = (e) => {
	// Remove the id from the list
	const popIndex = popUps.indexOf(e.target.id)
	// If there is an index before, add the attribute to that.
	popUps.splice(popIndex, 1)
	if (popUps.length !== 0)
		document
			.querySelector(`#${popUps[0]}`)
			.setAttribute(BACKDROP_ATTRIBUTE, true)
	e.target.remove()
}

const createPopUp = () => {
	const pop = document.createElement('div')
	const id = `pop--${popUps.length}`
	pop.setAttribute('popup', 'manual')
	pop.setAttribute('id', id)
	if (popUps.length === 0) pop.setAttribute(BACKDROP_ATTRIBUTE, true)
	pop.className = 'popup'
	pop.innerHTML = `
  Hey!<span class="popup__hand hand">👋</span>
  <button togglepopup="${id}"><span class="popup__close">&times;</span></button>
	`
	document.body.insertBefore(pop, ADDER)
	pop.addEventListener('hide', () => {
		pop.addEventListener('transitionend', destroyPopUp)
	})
	pop.style.setProperty('--x', randomInRange(20, 80))
	pop.style.setProperty('--y', randomInRange(20, 80))
	pop.style.setProperty('--wave-speed', randomInRange(1, 6))
	pop.style.setProperty('--wave-delay', randomInRange(0, 5))
	pop.style.setProperty(
		'--font-size',
		`var(--font-size-${randomInRange(2, 8)})`
	)
	popUps.push(id)
	pop.showPopUp()
	ADDER.hidePopUp()
	ADDER.showPopUp()
}

ADDER.addEventListener('click', createPopUp)
