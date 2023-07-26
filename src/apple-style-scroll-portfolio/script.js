const BLINKER = document.querySelector('.blinker p')

const COPY = BLINKER.innerText
BLINKER.innerHTML = ''
const WORDS = COPY.split(' ')
for (let w = 0; w < WORDS.length; w++) {
  const WORD = Object.assign(document.createElement('span'), {
    innerHTML: `${WORDS[w]}${w === WORDS.length - 1 ? '' : '&nbsp;'}`,
    className: WORDS[w].toLowerCase().includes('creativity') || WORDS[w].toLowerCase().includes('power') || WORDS[w].toLowerCase().includes('code') ? 'remain' : '',
  })
  BLINKER.appendChild(WORD)
}