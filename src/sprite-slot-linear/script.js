const go = document.querySelector('button')
const numbers = document.querySelectorAll('.machine__number')
const result = document.querySelector('[aria-live="polite"]')
let slides = [0, 0, 0]

const slide = () => {
  const first = Math.floor(Math.random() * 20 + 10)
  const second = first + Math.floor(Math.random() * 10 + 10)
  const third = second + Math.floor(Math.random() * 10 + 10)
  slides = [slides[0] + first, slides[1] + second, slides[2] + third]
  for (let n = 0; n < numbers.length; n++) {
    const number = numbers[n]
    number.style.setProperty('--iterations', slides[n])
  }
  result.innerText = slides
    .map((slide) => 10 - (slide % 10))
    .map((r) => (r === 10 ? 0 : r))
    .join('')
}

go.addEventListener('click', slide)
