const dialog = document.querySelector('dialog')
const open = document.querySelector('.open')
const close = document.querySelector('.close')

open.addEventListener('click', () => dialog.showModal())
close.addEventListener('click', () => dialog.close())
