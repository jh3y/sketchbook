const TOGGLE = document.querySelector('.toggle')

const TOGGLE_THEME = () => {
	TOGGLE.setAttribute('aria-pressed', TOGGLE.matches('[aria-pressed="true"]') ? false : true)
	// If :has isn't supported then we need to resort to classic classes
	if (!CSS.supports('selector(:has(*))'))
		document.body.setAttribute('data-has-a-dark-side', TOGGLE.matches('[aria-pressed="true"') ? true : false)
}

TOGGLE.addEventListener('click', TOGGLE_THEME)