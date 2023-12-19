import { GUI } from 'https://cdn.skypack.dev/dat.gui'
import gsap from 'https://cdn.skypack.dev/gsap'
import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.querySelector('#app')

console.clear()

const PHRASES = [
  'Wherever you go,<br/>the cursor follows',
  'Lean into CSS<br/>and the cascade',
  'One event listener powers it all',
  'One HTML attribute,<br/>feel the glow',
]

const PATHS = [
  "M17.303 5.197A7.5 7.5 0 0 0 6.697 15.803a.75.75 0 0 1-1.061 1.061A9 9 0 1 1 21 10.5a.75.75 0 0 1-1.5 0c0-1.92-.732-3.839-2.197-5.303Zm-2.121 2.121a4.5 4.5 0 0 0-6.364 6.364.75.75 0 1 1-1.06 1.06A6 6 0 1 1 18 10.5a.75.75 0 0 1-1.5 0c0-1.153-.44-2.303-1.318-3.182Zm-3.634 1.314a.75.75 0 0 1 .82.311l5.228 7.917a.75.75 0 0 1-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 0 1-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 0 1-1.247-.606l.569-9.47a.75.75 0 0 1 .554-.68Z",
  "M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z",
  "M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z",
  "M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z",
]

// Not using React? Jus' take this and drop it into a <script>
const useGlowPointer = () => {
  const UPDATE = React.useCallback(({ x, y }) => {
    document.documentElement.style.setProperty('--x', x.toFixed(2))
    document.documentElement.style.setProperty('--xp', (x / window.innerWidth).toFixed(2))
    document.documentElement.style.setProperty('--y', y.toFixed(2))
    document.documentElement.style.setProperty('--yp', (y / window.innerHeight).toFixed(2))
  }, [])
  React.useEffect(() => {
    document.body.addEventListener('pointermove', UPDATE)
    return () => {
      document.body.removeEventListener('pointermove', UPDATE)
    }
  }, [])
  return null
}

const App = () => {
  const setGlow = useGlowPointer()
  const controller = React.useRef(null)
  const [cards, setCards] = React.useState([])

  const removeCard = React.useCallback((id) => {
    controller.current.removeFolder(controller.current.__folders[`Card (${id})`])
    setCards((cards) => {
      return cards.filter(card => card.id !== id)
    })
  }, [cards])

  const addCard = () => {

    setCards((cards) => {
      if (cards.length === 4) return cards
      const newCard = {
        id: crypto.randomUUID(),
        border: 1,
        spread: gsap.utils.random(0, 1000),
        outer: false,
        control: false,
        base: gsap.utils.random(0, 359),
        saturation: 100,
        lightness: 50,
        size: 150,

      }
      // Add a folder to the controller
      const CARD_CONFIG = {
        removeCard: () => removeCard(newCard.id),
        ...newCard,
      }
      const UPDATE = () => {
        setCards((cards) => {
          return cards.map((card, index) => {
            if (card.id === newCard.id)
              return {
                ...newCard,
                ...CARD_CONFIG,
              }
            return card
          }) 
        })
      }
      const cardFolder = controller.current.addFolder(`Card (${newCard.id})`)
      // Add characteristics for each card here
      cardFolder.add(CARD_CONFIG, 'base', 0, 359, 1).name('Base Hue').onChange(UPDATE)
      cardFolder.add(CARD_CONFIG, 'spread', 0, 1000, 1).name('Hue Spread').onChange(UPDATE)
      cardFolder.add(CARD_CONFIG, 'border', 1, 5, 1).name('Border Width').onChange(UPDATE)
      cardFolder.add(CARD_CONFIG, 'size', 1, 250, 1).name('Spot Size').onChange(UPDATE)
      cardFolder.add(CARD_CONFIG, 'outer').name('Outer Glow').onChange(UPDATE)
      cardFolder.add(CARD_CONFIG, 'control').name('Control Glow').onChange(UPDATE)

      // Add a way to remove the card
      cardFolder.add(CARD_CONFIG, 'removeCard').name('Remove Card')

      return [...cards, newCard]
    })
  }

  const explode = () => {
    document.body.toggleAttribute('data-explode')
    const CARDS = document.querySelectorAll('article')
    CARDS.forEach(card => {
      const BOUNDS = card.getBoundingClientRect()
      card.style.setProperty('--left', BOUNDS.left)
      card.style.setProperty('--top', BOUNDS.top)
      const CONTROL = card.querySelector(':is(a, button)')
      const CONTROL_BOUNDS = CONTROL.getBoundingClientRect()
      CONTROL.style.setProperty('--left', CONTROL_BOUNDS.left)
      CONTROL.style.setProperty('--top', CONTROL_BOUNDS.top)
    })

  }

  const CONFIG = {
    addCard,
    explode: false,
  }
  // Use an effect to add Cards
  React.useEffect(() => {
    // Create a controller and use it to add/remove cards
    controller.current = new GUI({ width: 320 })
    controller.current.add(CONFIG, 'explode').name('Explode?').onChange(explode)
    controller.current.add(CONFIG, 'addCard').name('Add Card')
    // Add some default cards
    addCard()
    addCard()
  }, [])

  return (
    <main>
      {cards.map((card, index) => {
        return (
          <article
            className="card"
            data-glow
            style={{
              '--spotlight': `${card.size}px`,
              '--base': card.base,
              '--spread': card.spread,
              '--border-width': `${card.border}px`,
            }}
          >
            {card.outer ? <div data-glow></div> : null}
            <div className="card__content">
              <span>Pro</span>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="none" dataSlot="icon" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d={PATHS[index]} />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="none" dataSlot="icon" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d={PATHS[index]} />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="none" dataSlot="icon" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d={PATHS[index]} />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="none" dataSlot="icon" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d={PATHS[index]} />
                </svg>
              </div>
              <h2 dangerouslySetInnerHTML={{__html: PHRASES[index]}} />
            </div>
            <a href="#">
              {card.control ? <span data-glow></span>: null}
              Follow
            </a>
          </article>
        )
      })}
    </main>
  )
}

render(<App />, ROOT_NODE)
