import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import { useTweaks } from 'https://cdn.skypack.dev/use-tweaks'

const ROOT_NODE = document.querySelector('#app')

const App = () => {
  const { color, txt, speed, image, stagger, depth, rotation, perspective } = useTweaks({
    txt: 'Hi, how are you?',
    color: '#764d8c',
    speed: { value: 1, min: 0.5, max: 5, step: 0.1 },
    stagger: { value: 0.6, min: 0, max: 5, step: 0.1 },
    depth: { value: 2, min: 0, max: 20, step: 1 },
    rotation: { value: 4, min: 0, max: 40, step: 1 },
    perspective: { value: 80, min: 0, max: 200, step: 1 },
  })

  const chars = txt.split('')

  return (
    <>
      <h1 style={{ '--color': color, '--speed': speed, '--size': image, '--count': chars.length, '--stagger': stagger, '--depth': depth, '--rotation': rotation, '--perspective': perspective }}>
        <span className="wave" aria-hidden="true">
          {chars.map((c, index) => {
            if (c === ' ') return <span key={`char-${txt}--${index}`} style={{'--index': index}}>&nbsp;</span>
            return <span key={`char-${txt}--${index}`} style={{'--index': index}}>{c}</span>
          })}
        </span>
        <span className="sr-only">{txt}</span>
      </h1>
    </>
  )
}

render(<App />, ROOT_NODE)
