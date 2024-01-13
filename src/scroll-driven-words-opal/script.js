const section = document.querySelector('.reader')
const srOnly = document.querySelector('.sr-only')
const toSplit = document.querySelector('[data-split]')
const content = toSplit.innerText
const contentLength = content.length

const PPC = 10 // Pixels per character...
const BUFFER = 40
const IMAGES = 3
const IMAGE_COST = 10
/**
 * Iterate over the words.
 * Add them in creating start and finish indexes for them.
 * */
section.style.height = `${
  PPC * (contentLength + 2) +
  window.innerHeight +
  4 * BUFFER +
  IMAGES * IMAGE_COST * BUFFER
}px`
const words = toSplit.innerText.split(' ')
toSplit.innerHTML = ''
toSplit.style.setProperty('--ppc', PPC)
let cumulation = 2
words.forEach((word, index) => {
  const text = Object.assign(document.createElement('span'), {
    innerText: word + ' ',
    style: `
      --index: ${index};
      --start: ${cumulation};
      --end: ${cumulation + word.length};
    `,
  })
  cumulation += word.length + 1
  toSplit.appendChild(text)
  if (index === 2 || index === 27) {
    const img = Object.assign(document.createElement('img'), {
      src: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 100 + 1)}`,
      alt: '',
      style: `
        --rotate: ${-20 + Math.floor(Math.random() * 40)}deg;
        --start: ${cumulation};
        --end: ${cumulation + IMAGE_COST};
      `
    })
    cumulation += IMAGE_COST
    toSplit.appendChild(img)
  }
})

// const contentBlock = document.querySelector('.content')
// if (contentBlock.offsetHeight > window.innerHeight) {
//   console.info(parseInt(section.style.height, 10))
//   const height = parseInt(section.style.height, 10) - (contentBlock.offsetHeight + (contentBlock.offsetHeight - window.innerHeight))
//   section.style.height = `${height}px`
// }
// console.info(contentBlock.offsetHeight, window.innerHeight)