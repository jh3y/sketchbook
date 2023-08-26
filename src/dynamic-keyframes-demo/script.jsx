import React, {
  useRef,
  useEffect,
  Fragment,
  useState,
} from 'https://cdn.skypack.dev/react'
import Prism from 'https://cdn.skypack.dev/prismjs'
import { Range } from 'https://cdn.skypack.dev/react-range'
import { render } from 'https://cdn.skypack.dev/react-dom'

// const { Prism } = window

const ROOT_NODE = document.querySelector('#app')

const getCode = (x, y) => {
  let RESULT = ``
  RESULT += `.box {
  animation: enter 2s;
}
  `
  RESULT += `
.box:first-of-type {\n`
  RESULT += `  --x: ${x}%;\n`
  RESULT += `  --y: ${y}%;\n`
  RESULT += '}\n'
  RESULT += `
.box:last-of-type {\n`
  RESULT += `  --x: 0%;\n`
  RESULT += `  --y: 200%;\n`
  RESULT += '}\n\n'

  RESULT += `@keyframes enter {\n`
  RESULT += `  0% {
    opacity: 0;
    translate: var(--x, 0) var(--y, 0);
  }\n`

  return (RESULT += '}')
}

const getCodeMarkup = (code) => {
  return Prism.highlight(code, Prism.languages.css, 'css')
}

const App = () => {
  const [fromX, setFromX] = useState(100)
  const [fromY, setFromY] = useState(0)
  const [replayKey, setReplayKey] = useState(Date.now())
  const cssString = useRef(getCode(fromX, fromY))
  const cssRef = useRef(getCodeMarkup(cssString.current))

  useEffect(() => {
    cssRef.current = getCodeMarkup(getCode(fromX, fromY))
    setReplayKey(Date.now())
  }, [fromX, fromY])

  const replay = () => {
    setReplayKey(Date.now())
  }

  return (
    <div className="scene">
      <button className="replay" title="Replay" onClick={replay}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        <span className="sr-only">Replay</span>
      </button>
      <div className="result">
        <pre>
          <code
            className="language-css"
            dangerouslySetInnerHTML={{ __html: cssRef.current }}
          />
        </pre>
        <div className="result__render" key={replayKey}>
          <div
            className="box"
            style={{ '--x': `${fromX}%`, '--y': `${fromY}%` }}
          />
          <div className="box" />
        </div>
      </div>
      <div className="controls">
        <label htmlFor="x">Origin X</label> 
        <input
          id="x"
          type="range"
          min="-300"
          max="300"
          step="10"
          value={fromX}
          onInput={(e) => setFromX(e.target.value)}
        />
        <label htmlFor="y">Origin Y</label> 
        <input
          id="y"
          type="range"
          min="-300"
          max="300"
          step="10"
          value={fromY}
          onInput={(e) => setFromY(e.target.value)}
        />
      </div>
    </div>
  )
}

render(<App />, ROOT_NODE)
