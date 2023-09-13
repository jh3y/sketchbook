// Show the island
const TRIGGER = document.querySelector('.trigger')
const MAIN = document.querySelector('main')
const COG = document.querySelector('.cog-container')
const QUOTE = document.querySelector('blockquote')
// let count = 0

const LOAD_TIME = 3000

let newQuote

const getQuote = async () => {
  const data = await (await fetch('https://www.jcquotes.com/api/quotes/random')).json()
  console.info({ data })
  return data
}

const updateQuote = () => {
  document.startViewTransition(() => {
    QUOTE.innerText = newQuote.text
    QUOTE.cite = newQuote.source
  })
}

newQuote = await getQuote()
updateQuote()

const RESET = event => {
  if (event.animationName === 'unload') {
    COG.removeEventListener('animationend', RESET)
    delete document.documentElement.dataset.refreshing
  }
}

const UNLOAD = () => {
  updateQuote()
  COG.addEventListener('animationend', RESET)
  document.documentElement.dataset.refreshing = false
}

TRIGGER.addEventListener('animationstart', async () => {
  if (document.documentElement.scrollTop <= 2) {
    // Into the loading state...
    document.documentElement.dataset.refreshing = true

    newQuote = await getQuote()
    setTimeout(UNLOAD, Math.random() * LOAD_TIME + 2000)
  }
})