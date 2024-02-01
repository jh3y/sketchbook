import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import tweakpane from 'https://cdn.skypack.dev/tweakpane'
import { useTweaks } from 'https://cdn.skypack.dev/use-tweaks'

const ROOT_NODE = document.querySelector('#app')

const App = () => {
  const tweakPanelRef = React.useRef(null)
  const {
    element: el,
    hue,
    border,
    inset,
    monochrome,
    radius,
    glow,
    opacity,
    anchor,
    speed,
    explode,
    style,
  } = useTweaks("Configuration", {
    speed: {
      value: 2,
      min: 1,
      max: 20,
      step: 0.1,
    },
    hue: {
      value: Math.floor(Math.random() * 359),
      min: 0,
      max: 359,
      step: 1,
    },
    border: {
      value: 2,
      max: 10,
      min: 1,
      step: 1,
    },
    radius: {
      value: 6,
      max: 50,
      min: 0,
      step: 1,
    },
    opacity: {
      value: 1,
      max: 1,
      min: 0.1,
      step: 0.01,
    },
    glow: {
      value: 60,
      max: 200,
      min: 10,
      step: 1,
    },
    anchor: {
      value: 100,
      max: 100,
      min: 0,
      step: 1,
    },
    inset: { value: false },
    monochrome: { value: false },
    element: {
      value: 'button',
      options: ['button', 'article'],
    },
    style: {
      value: 'single',
      options: ['single', 'double'],
    },
    explode: { value: false },
  }, { container: tweakPanelRef })

  const Comp = el

  return (
    <>
      <div className="tweakpane" ref={tweakPanelRef} />
      <div
        key={el + style}
        className="scene"
        data-explode={explode}
        data-inset={inset}
        data-half={style === 'half-n-half'}
        data-monochrome={monochrome}
        data-double={style === 'double'}
        style={{
          '--hue': hue,
          '--border': border,
          '--radius': radius,
          '--glow': glow,
          '--anchor': anchor,
          '--speed': speed,
          '--opacity': opacity,
        }}
      >
        <Comp className="el">
          <span data-glow />
          <span
            className="el__content"
            {...(el === 'button' ? { contentEditable: true } : null)}
          >
            {el === 'button' ? (
              'Button'
            ) : (
              <h3>
                <span>CSS in 2024</span>
                <span>Game changing APIs to make your life easier.</span>
              </h3>
            )}
          </span>
        </Comp>
        <span data-glow />
      </div>
    </>
  )
}

render(<App />, ROOT_NODE)
