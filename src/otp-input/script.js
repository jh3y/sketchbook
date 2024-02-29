/**
 * Snippet of code to update the highlight index
 * */

const otp = document.querySelector('.otp')
const input = otp.querySelector('input')

const update = () => {
  otp.style.setProperty('--rl', input.selectionStart === 0 ? 1 : 0)
  otp.style.setProperty('--rr', input.selectionStart >= input.maxLength - 1 ? 1 : 0)
  otp.style.setProperty('--index', input.selectionStart)
}

input.addEventListener('keyup', update)
input.addEventListener('click', update)
input.addEventListener('focus', update)
update()
