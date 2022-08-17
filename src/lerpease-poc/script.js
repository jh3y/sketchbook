import { gsap } from 'gsap'

let lerpease
let hoverBlocks
const MIRROR_CHECK = document.querySelector('#mirror')
const ITEM_RANGE = document.querySelector('#items')
const EASE_SELECTOR = document.querySelector('#curve')

const BLOCKS = document.querySelector('.blocks')

const STATE = {
	mirror: MIRROR_CHECK.checked,
	items: parseInt(ITEM_RANGE.value, 10),
	ease: EASE_SELECTOR.value,
}

const setLerpease = () => {
	lerpease = gsap.utils.distribute({
		base: 0,
		amount: 1,
		from: 0,
		ease: STATE.ease,
	})
}

const LERPS = []

const injectLerps = lerps => {
	document.documentElement.style = ''
	for (let l = 0; l < lerps.length; l++) {
		document.documentElement.style.setProperty(`--lerp-${l}`, lerps[l])
	}
}

const refreshBlocks = (e) => {
	STATE.ease = e.target.value
	setLerpease()
	const ITEMS = [...BLOCKS.children]
	const ITEM_COUNT = new Array(STATE.items).fill()
	LERPS.length = 0
	ITEMS.forEach((item) => {
		const index = parseInt(item.getAttribute('data-index'), 10)
		const l = lerpease(index, ITEM_COUNT[index], ITEM_COUNT)
		LERPS.push(l)
		Object.assign(item, {
			style: `--lerp: ${l}; --index: ${index}; --bg: var(--gradient-${
				index + 1
			});`,
		})
	})

	injectLerps(LERPS.slice(0, STATE.items).reverse())
}

const generateBlock = (l, index) => {
	const BLOCK = Object.assign(document.createElement('div'), {
		className: 'block',
		style: `--lerp: ${l}; --index: ${index}; --bg: var(--gradient-${
			index + 1
		});`,
		innerHTML: `
			<div class="block__item"></div>
		`,
	})
	BLOCK.setAttribute('data-index', index)
	BLOCKS.appendChild(BLOCK)
}

const generateBlocks = () => {
	BLOCKS.innerHTML = ''
	/**
	 * Calculate the Array length and generate the elements.
	 * If it's mirrored, generate extra blocks with a reverse loop.
	 * */
	const ITEM_COUNT = new Array(STATE.items).fill()
	const MIRROR_COUNT = Math.floor((STATE.items * 2 - (STATE.items % 2)) * 0.5)
	// Set the CSS styles for the container
	BLOCKS.style.setProperty(
		'--blocks',
		STATE.mirror ? STATE.items + MIRROR_COUNT : STATE.items
	)
	// Using the lerpease from the state, generate blocks
	LERPS.length = 0
	for (let i = 0; i < ITEM_COUNT.length; i++) {
		const LERP = lerpease(i, ITEM_COUNT[i], ITEM_COUNT)
		LERPS.push(LERP)
		generateBlock(LERP, i)
	}
	// Now, if we're mirrored, add extra items that count back
	if (STATE.mirror) {
		// If you have 5, you wanna add 4. If you have 4, you add 0.
		// modulo
		for (let m = MIRROR_COUNT; m > 0; m--) {
			const LERP = lerpease(m - 1, ITEM_COUNT[m], ITEM_COUNT)
			generateBlock(LERP, m - 1)
		}
	}
	injectLerps(LERPS.reverse())
	// Clone the blocks as hover blocks
	if (hoverBlocks) hoverBlocks.remove()
	hoverBlocks = BLOCKS.cloneNode(true)
	hoverBlocks.classList.add('blocks--hover')
	document.body.appendChild(hoverBlocks)
}

const build = () => {
	setLerpease()
	generateBlocks()
}

build()

EASE_SELECTOR.addEventListener('change', refreshBlocks)
ITEM_RANGE.addEventListener('change', (e) => {
	STATE.items = parseInt(e.target.value)
	build()
})
MIRROR_CHECK.addEventListener('change', (e) => {
	STATE.mirror = e.target.checked
	build()
})
