import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

console.clear()

gsap.registerPlugin(Draggable)

let open = false

const SNAP_THRESHOLD = 150
const POPOVER = document.querySelector('[popover]')
const LIST = POPOVER.querySelector('.drag-list')
const SELECTMENU = document.querySelector('selectmenu')
const SELECTVALUE = SELECTMENU.querySelector('[behavior=selected-value]')
const HANDLE = SELECTMENU.querySelector('.handle')
const SELECTBUTTON = SELECTMENU.querySelector('button')
const PROXY = document.createElement('div')

window.SELECT = SELECTMENU

const LOOKUP = {
	red: {
		label: 'Red',
		hue: 10,
	},
	orange: {
		label: 'Orange',
		hue: 30,
	},
	yellow: {
		label: 'Yellow',
		hue: 45,
	},
	green: {
		label: 'Green',
		hue: 140,
	},
	blue: {
		label: 'Blue',
		hue: 210,
	},
}

const STRETCH_SCALE = gsap.utils.mapRange(0, SNAP_THRESHOLD, 1, 2)
const SPEED_SCALE = gsap.utils.mapRange(0, SNAP_THRESHOLD, 1, 0.3)

const RESET = () => {
	gsap.set(PROXY, {
		x: 0,
		y: 0,
	})
}

POPOVER.addEventListener('toggle', ({ newState, oldState }) => {
	if (newState === 'closed' && oldState === 'open') {
		gsap.set(LIST, { clearProps: 'all' })
	}
})

SELECTMENU.value = null

let t
const CLONE = () => {
	const SELECTED = SELECTMENU.value
	gsap.set('[behavior=button] .sock', { clearProps: true })
	gsap.to('[behavior=button] .sock', {
		scale: 1.25,
		rotate: 10,
		yoyo: true,
		repeat: 1,
		duration: 0.1,
	})
	if (SELECTED) SELECTMENU.style.setProperty('--hue', LOOKUP[SELECTED].hue)
	SELECTVALUE.innerText = SELECTED ? LOOKUP[SELECTED].label : 'Socks?'
}

CLONE()

SELECTMENU.addEventListener('input', CLONE)

const onDrag = function () {
	if (!this.__allowDrag) return
	const scaleY = gsap.utils.clamp(
		1,
		2,
		Math.max(1, this.y / this.__popoverHeight + 1)
	)
	// console.info(this.y / this.__popoverHeight)

	const yPercent = gsap.utils.clamp(0, 100, (this.y / this.__popoverHeight) * 100)

	gsap.set(LIST, {
		yPercent,
	})
}

const onDragStart = function ({ x, y }) {
	const BOUNDS = POPOVER.getBoundingClientRect()
	gsap.set(LIST, { transition: 'none' })
	gsap.set('option', { pointerEvents: 'none' })
	this.__allowDrag = y > BOUNDS.bottom - 50
	this.__popoverHeight = BOUNDS.height
}

const onRelease = function () {
	// Reset the proxy handle
	RESET()
	this.__allowDrag = false
	// Snap it closed if over the threshold
	// Else snap it back to scale 1?
	const duration = gsap.utils.clamp(0.5, 1, SPEED_SCALE(this.y))
	if (this.y > SNAP_THRESHOLD && POPOVER.matches(':popover-open')) {
		gsap
			.timeline({
				onStart: () => {
					// gsap.set(POPOVER, { transition: 'none' })
				},
				onComplete: () => {
					console.info('completed')
					gsap.set('option', { pointerEvents: 'all' })
					gsap.set(LIST, { clearProps: 'all' })
					if (POPOVER.matches(':popover-open')) POPOVER.hidePopover()
				},
			})
			.to(LIST, {
				ease: 'elastic.out(1, 1)',
				yPercent: -100,
				duration,
			})
	} else if (
		this.y > 0 &&
		((this.y < SNAP_THRESHOLD && POPOVER.matches(':popover-open')) ||
		(this.y < SNAP_THRESHOLD && !POPOVER.matches(':popover-open')))
	) {
		// gsap.set(LIST, { transition: 'none' })
		gsap.to(LIST, {
			onComplete: () => {
				gsap.set(LIST, { clearProps: true })
				gsap.set('option', { pointerEvents: 'all' })
			},
			duration,
			yPercent: 0,
			ease: 'elastic.out(1, 0.3)',
		})
	} else if (
		!POPOVER.matches(':popover-open') &&
		this.y > SNAP_THRESHOLD
	) {
		// gsap.set(LIST, { transition: 'none' })
		gsap.to(LIST, {
			onStart: () => {
				POPOVER.showPopover()
			},
			onComplete: () => {
				gsap.set(LIST, { clearProps: true })
				gsap.set('option', { pointerEvents: 'all' })
			},
			duration,
			yPercent: 100,
			ease: 'elastic.out(1, 0.3)'
		})
	} else if (event.target === HANDLE && this.y === 0) {
		if (POPOVER.matches(':popover-open')) {
			POPOVER.hidePopover()
		} else {
			POPOVER.showPopover()
		}
	}
}

Draggable.create(PROXY, {
	trigger: POPOVER,
	type: 'y',
	onDrag: function () {
		onDrag.bind(this)()
	},
	onDragStart: function (args) {
		onDragStart.bind(this)(args)
	},
	onRelease: function () {
		onRelease.bind(this)()
	},
})