const HATCH = document.querySelector('#escape-hatch')

const insertStyles = styles => HATCH.innerHTML += styles

const STYLES_TO_INSERT = `
	@scroll-timeline first-timeline {
		source: auto;
		scroll-offsets: 0, 100px;
	}
`

insertStyles(STYLES_TO_INSERT)