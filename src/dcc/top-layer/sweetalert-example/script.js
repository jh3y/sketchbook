import swal from 'sweetalert'

const BUTTON = document.querySelector('button.open')
const content = document.createElement('div')
content.innerHTML = `Rad! <span class="hand">🤙</span>`

BUTTON.addEventListener('click', () => {
	swal({
		content
	})
})
