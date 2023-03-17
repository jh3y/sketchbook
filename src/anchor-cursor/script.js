const CURSOR = Object.assign(document.createElement('span'), {
	className: 'cursor',
	ariaHidden: true
})
document.body.appendChild(CURSOR)

let inactiveTimer
const TIMEOUT = 1000

const ANCHOR_SUPPORT = CSS.supports('anchor-name: --foo')

document.body.setAttribute('magnetic-cursor', true)

const UPDATE = ({ x, y }) => {
	// Need to check if there is a focussed item at this point.
	const FOCUSSED = document.querySelector(':focus-visible')
	if (FOCUSSED) {
		FOCUSSED.blur()
	}
	document.documentElement.style.setProperty('--active', 1)
	document.documentElement.style.setProperty('--x', Math.floor(x))
	document.documentElement.style.setProperty('--y', Math.floor(y))
	if (inactiveTimer) clearTimeout(inactiveTimer)
	inactiveTimer = setTimeout(() => {
		document.documentElement.style.setProperty('--active', 0)
	}, TIMEOUT)
}

const ANCHOR_POINTS = document.querySelectorAll('[data-anchor]')

const PARA_ANCHOR = ({x, y}) => {
	const { top, right, bottom, left, height, width } = activeAnchor.getBoundingClientRect()
	const ratio_x = (((x - left) / width) - 0.5) * 2
	const ratio_y = (((y - top) / height) - 0.5) * 2
	document.documentElement.style.setProperty('--rx', ratio_x.toFixed(2))
	document.documentElement.style.setProperty('--ry', ratio_y.toFixed(2))
}

const funcs = []

let activeAnchor
const TEARDOWN = (e) => {
	document.documentElement.style.setProperty('--rx', 0)
	document.documentElement.style.setProperty('--ry', 0)
	document.body.removeEventListener('pointermove', PARA_ANCHOR)
	e.target.removeAttribute('data-anchor-active')
	e.target.removeEventListener('pointerleave', TEARDOWN)
}


const ACTIVATE_ANCHOR = e => {
	// Gonna need these anyway...
	const { top, right, bottom, left, height, width } = e.target.getBoundingClientRect()
	if (ANCHOR_SUPPORT) {
		document.documentElement.style.setProperty('--anchor', e.target.getAttribute('data-anchor-name'))
	} else {
		// Gonna have to set x1, x2, y1, y2 via getBoundingClientRect... boo.
		document.documentElement.style.setProperty('--x1', `${left}px`);
		document.documentElement.style.setProperty('--x2', `${(window.innerWidth - (left + width))}px`);
		document.documentElement.style.setProperty('--y1', `${top}px`);
		document.documentElement.style.setProperty('--y2', `${window.innerHeight - (top + height)}px`);
	}

	// Once the anchor position is set, you need to account for the parallaxy movement thing and we can use clamp for that I think.
	document.documentElement.style.setProperty('--max-w', `${width}px`)
	document.documentElement.style.setProperty('--max-h', `${height}px`)
	e.target.setAttribute('data-anchor-active', true)
	activeAnchor = e.target
	document.body.addEventListener('pointermove', PARA_ANCHOR)
	e.target.addEventListener('pointerleave', TEARDOWN)
	e.target.addEventListener('blur', TEARDOWN)
}

ANCHOR_POINTS.forEach(ANCHOR => {
	if (ANCHOR_SUPPORT) {
		const ANCHOR_ID = `--${crypto.randomUUID()}`
		ANCHOR.setAttribute('data-anchor-name', ANCHOR_ID)
		ANCHOR.style.anchorName = ANCHOR_ID
	}
	ANCHOR.addEventListener('pointerenter', ACTIVATE_ANCHOR)
	ANCHOR.addEventListener('focus', ACTIVATE_ANCHOR)
})

document.body.addEventListener('pointermove', UPDATE)