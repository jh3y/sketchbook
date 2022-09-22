import "../../../../net/experimental-web-platform/script.js";

const NAV_CONTROL = document.querySelector('button')

const CONTROL_NAV = () => {
	NAV_CONTROL.setAttribute('aria-expanded', NAV_CONTROL.matches('[aria-expanded="false"]') ? true : false)
	NAV_CONTROL.setAttribute('aria-pressed', NAV_CONTROL.matches('[aria-expanded="false"]') ? true : false)
}

NAV_CONTROL.addEventListener('click', CONTROL_NAV)