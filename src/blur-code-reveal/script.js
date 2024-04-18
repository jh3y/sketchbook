import splitting from 'https://cdn.skypack.dev/splitting'

const target = document.querySelectorAll('.fader')

splitting({
  target,
  by: 'chars',
})

const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value)
  } catch (error) {
    console.error(error)
  }    
}

const copyMaster = document.querySelector('button')
let copyClear
const copy = async () => {
  await copyToClipboard(document.querySelector('input').value)
  document.documentElement.dataset.copied = true
  if (copyClear !== undefined) clearTimeout(copyClear)
  copyClear = setTimeout(() => {
    document.documentElement.dataset.copied = false
  }, 5000)
}

copyMaster.addEventListener('click', copy)
