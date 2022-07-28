const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
	const INPUT_RANGE = inputUpper - inputLower
	const OUTPUT_RANGE = outputUpper - outputLower
	return (value) =>
		outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}
const clamp = (min, max, value) => Math.min(Math.max(value, min), max)

const ARTICLE = document.querySelector('main')

const STATE = {
	ACTIVE: false,
	'--column-count': 1,
}

const SYNC = () => {
	Object.keys(STATE).forEach(
		(key) =>
			key.indexOf('--') !== -1 &&
			document.documentElement.style.setProperty(key, STATE[key])
	)
}

document.body.addEventListener('dblclick', () => {
	STATE['--column-count'] = STATE['--column-count'] === 2 ? 1 : 2
	SYNC()
})

/**
 *  Basing on open-props scales
 * --font-size-{00-8}
 * --font-size-fluid-{0-3}
 * --font-weight-{1-9}
 * --font-letterspacing-{0-7}
 * --font-lineheight-{00-5}
 * */

const ADJUST = ({ x, y }) => {
	const { left, width, height, top } = ARTICLE.getBoundingClientRect()
	// Work out the distance of X based on where you've put the pointer down
	// Mapped to the width of article against a font range
	const HORIZONTAL_PERCENTAGE = clamp(
		0,
		100,
		mapRange(left, left + width, 0, 100)(x)
	)
	const VERTICAL_PERCENTAGE = clamp(
		0,
		100,
		mapRange(top, top + height, 0, 100)(y)
	)
	document.documentElement.style.setProperty(
		'--font-size',
		`var(--font-size-${clamp(0, 8, Math.floor(mapRange(0, 100, 0, 8)(HORIZONTAL_PERCENTAGE)))})`
	)
	document.documentElement.style.setProperty(
		'--line-height',
		`var(--font-lineheight-${clamp(0, 5, Math.floor(mapRange(0, 100, 0, 5)(VERTICAL_PERCENTAGE)))})`
	)
}

const ACTIVATE_DRAG = () => {
	STATE.ACTIVE = true
	document.body.addEventListener('pointermove', ADJUST)
}

const DEACTIVATE_DRAG = () => {
	STATE.ACTIVE = false
	document.body.removeEventListener('pointermove', ADJUST)
}

document.body.addEventListener('pointerdown', ACTIVATE_DRAG)
document.body.addEventListener('pointerup', DEACTIVATE_DRAG)
