const TOGGLE = document.querySelector('button')

const UPDATE = () => {
  const DARK = TOGGLE.matches('[aria-pressed=true]')
  TOGGLE.setAttribute('aria-pressed', DARK ? false : true )
  document.documentElement.className = DARK ? 'dark' : ''
}

const TOGGLE_THEME = () => {

  if (!document.startViewTransition) return UPDATE()
  document.startViewTransition(() => UPDATE())

}

TOGGLE.addEventListener('click', TOGGLE_THEME)

if (!CSS.supports('animation-timeline: scroll()')) {
  console.info('backfill with IntersectionObserver')
  const marks = document.querySelectorAll('mark')

  const onObserve = (entries) => {
    // console.info(entries)
    entries.forEach(entry => {
      entry.target.style.setProperty('--highlighted', entry.isIntersecting ? 1 : 0)
    })
  }

  const highlightObserver = new IntersectionObserver(onObserve, {
    rootMargin: 0,
    threshold: 0
  })

  console.info({ marks })

  marks.forEach(mark => highlightObserver.observe(mark))
}
