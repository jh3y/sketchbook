import Prism from 'https://cdn.skypack.dev/prismjs'
import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

const keys = [
  'none',
  'quad',
  'power-1',
  'power-2',
  'power-3',
  'power-4',
  'cubic',
  'quart',
  'quint',
  'strong',
  'elastic',
  'bounce',
  'expo',
  'circ',
  'sine',
  'back',
]

const getCode = (key, speed) => {
  const ease = getComputedStyle(document.documentElement).getPropertyValue(`--${key}`)
  console.info({ ease, key })
  let chunks = '\n    '

  for (let i = 0; i < ease.split(',').length; i+=5) {
    chunks += `${ease.split(',').slice(i, i + 5).join(',')}${i >= ease.split(',').length - 5 ? '' : ','}${i >= ease.split(',').length - 5 ? ';' : '\n'}      `
  }
  // --${key}: ${ease.split(',').join(',\n    ')};
  return `:root {
  --${key}: ${chunks}
  --speed: ${speed}s;
}
  `
}

const App = () => {
  const [ease, setEase] = React.useState('elastic-in')
  const [speed, setSpeed] = React.useState(2)
  const [animation, setAnimation] = React.useState('su')
  const [flipped, setFlipped] = React.useState(false)
  const [replayKey, setReplayKey] = React.useState(Date.now)
  const cssRef = React.useRef(Prism.highlight(getCode(ease, speed), Prism.languages.css, 'css'))

  const changeEase = (event) => {
    cssRef.current = Prism.highlight(getCode(event.target.value, speed), Prism.languages.css, 'css')
    setEase(event.target.value)
  }
  const changeAnimation = (event) => {
    setAnimation(event.target.value)
  }
  const changeSpeed = (event) => {
    cssRef.current = Prism.highlight(getCode(ease, event.target.value), Prism.languages.css, 'css')
    setSpeed(event.target.value)
  }
  const flip = () => {
    setFlipped(!flipped)
  }

  const replay = () => {
    setReplayKey(Date.now)
  }

  return (
    <main>
      <div className={`container-wrap ${flipped ? 'container-wrap--flipped' : ''}`} style={{'--show-code': flipped ? 1 : 0}}>
        <button className="flipper" onClick={flip} aria-pressed={flipped} title={flipped ? 'Show Animation' : 'Show CSS'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
          </svg>
        </button>
        <button className="replay" onClick={replay} title="Replay Animation">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
        <div className="container">
          <div className="front" key={replayKey}>
            <div
              key={Date.now()}
              className={`box ${animation}`}
              style={{ '--ease': `var(--${ease})`, '--speed': speed }}
            >
              ease
            </div>
          </div>
          <div className="code-panel">
            <pre>
              <code
                className="language-css"
                dangerouslySetInnerHTML={{ __html: cssRef.current }}
              />
            </pre>
          </div>
        </div>
      </div>
      <div className="controls">
        <label for="ease">Ease</label>
        <select value={ease} id="ease" onChange={changeEase}>
          {keys.map((key) => {
            if (key === 'none') {
              return <option value="none">None</option>
            } else {
              const label = `${key.charAt(0).toUpperCase()}${key.slice(1)}`
              return (
                <optgroup label={label}>
                  <option value={`${key}-in`}>{`${label} In`}</option>
                  <option value={`${key}-out`}>{`${label} Out`}</option>
                  <option value={`${key}-in-out`}>{`${label} In Out`}</option>
                </optgroup>
              )
            }
          })}
        </select>
        <label for="animation">Animation</label>
        <select id="animation" value={animation} onChange={changeAnimation}>
          <option value="ltr">Left to Right</option>
          <option value="rtl">Right to Left</option>
          <option value="ttb">Top to Bottom</option>
          <option value="btt">Bottom to Top</option>
          <option value="si">Scale In</option>
          <option value="so">Scale Out</option>
          <option value="sd">Scale Down</option>
          <option value="su">Scale Up</option>
        </select>
        <label for="speed">Speed</label>
        <input
          onChange={changeSpeed}
          type="range"
          min="1"
          max="10"
          step="0.1"
          value={speed}
        />
      </div>
    </main>
  )
}

render(<App />, document.querySelector('#app'))
