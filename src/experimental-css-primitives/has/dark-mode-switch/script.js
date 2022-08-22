const BUTTON = document.querySelector('[aria-pressed]')

BUTTON.addEventListener('click', () => BUTTON.setAttribute('aria-pressed', BUTTON.matches('[aria-pressed="true"]') ? false : true))