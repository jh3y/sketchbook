import { gsap } from 'gsap'
import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import MorphSVGPlugin from 'gsap/MorphSVGPlugin'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrambleTextPlugin, MorphSVGPlugin)

const BLINK_SPEED = 0.075
const duration = 0.125

const ROOT_NODE = document.querySelector('#app')

const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value)
  } catch (error) {
    console.error(error)
  }    
}

const value = `${gsap.utils.random(999, 10_000, 1)} ${gsap.utils.random(999, 10_000, 1)} ${gsap.utils.random(999, 10_000, 1)} ${gsap.utils.random(999, 10_000, 1)}`
const App = () => {
  const blinkTl = React.useRef(null)
  const eye = React.useRef(null)
  const copyClear = React.useRef(null)
  const [visible, setVisible] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  
  const BLINK = () => {
    const delay = gsap.utils.random(2, 8)
    const duration = BLINK_SPEED
    const repeat = Math.random() > 0.5 ? 3 : 1
    if (blinkTl.current) blinkTl.current.kill()
    blinkTl.current = gsap.timeline({
      delay,
      onComplete: () => BLINK(),
      repeat,
      yoyo: true,
    })
      .to('.lid--upper', {
        morphSVG: '.lid--lower',
        duration,
      })
      .to('#eye-open path', {
        morphSVG: '#eye-closed path',
        duration,
      }, 0)
  }

  const copy = async () => {
    await copyToClipboard(value)
    setCopied(true)
    if (copyClear !== undefined) clearTimeout(copyClear)
    copyClear.current = setTimeout(() => setCopied(false), 5000)
  }

  React.useEffect(() => {
    BLINK()
    return () => {
      if (blinkTl.current) blinkTl.current.kill()
    }
  }, [])

  React.useEffect(() => {
    const posMapper = gsap.utils.mapRange(-100, 100, 30, -30)
    let reset
    const MOVE_EYE = ({ x, y }) => {
      if (reset) reset.kill()
      reset = gsap.delayedCall(2, () => {
        gsap.to(eye.current, { xPercent: 0, yPercent: 0, duration: 0.2 })
      })
      const BOUNDS = eye.current.getBoundingClientRect()
      // Get distance and angle between two points
      gsap.set(eye.current, {
        xPercent: gsap.utils.clamp(-30, 30, posMapper(BOUNDS.x - x)),
        yPercent: gsap.utils.clamp(-30, 30, posMapper(BOUNDS.y - y))
      })
    }
    window.addEventListener('pointermove', MOVE_EYE)
  }, [])

  // Eye open/close animations
  React.useEffect(() => {
    if (visible) {
      blinkTl.current.kill()
      gsap.timeline({ onComplete: () => {
      }})
        // Close the eye first and kill the TL
        .to('.lid--upper', {
          morphSVG: '.lid--lower',
          duration,
        })
        .to('#eye-open path', {
          morphSVG: '#eye-closed path',
          duration,
        }, 0)
      } else {
        gsap.timeline({
          onComplete: () => {
            BLINK()
          }
        })
          .to('.lid--upper', {
            morphSVG: '.lid--upper',
            duration,
          })
          .to('#eye-open path', {
            morphSVG: '#eye-open path',
            duration,
          }, 0)
      }
  }, [visible])

  return (
    <form action="">
      <div className="form-group" data-visible={visible} data-copied={copied}>
        <label for="number">Number</label>
        <div className="dummy" aria-hidden="true">
          {value.split('').map((char, index) => {
            return (
              <span className={`dummy__char ${index > 13 ? 'dummy__char--static' : ''}`} key={`${char}--${index}`}>
                {index <= 13 && char !== ' ' ? <span style={{'--index': index }}>•</span> : null}
                <span style={{'--index': index }}>{char}</span>
              </span>
            )
          })}
        </div>
        <input id="number" type={visible ? "text" : "password"} readOnly defaultValue={value} className="sr-only" />
        <div className="form-group__actions">
          <button type="button" title="Reveal Password" aria-pressed={visible} onClick={() => setVisible(!visible)}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <mask id="eye-open">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12V20H12H1V12Z" fill="#D9D9D9" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                </mask>
                <mask id="eye-closed">
                  <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12V20H12H1V12Z" fill="#D9D9D9"/>
                </mask>
              </defs>
              <path
                className="lid lid--upper"
                d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                className="lid lid--lower"
                d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g mask="url(#eye-open)">
                <g className="eye" ref={eye}>
                  <circle cy="12" cx="12" r="4" fill="currentColor" />
                  <circle cy="11" cx="13" r="1" fill="black" />
                </g>
              </g>
            </svg>
            <span className="sr-only">Reveal</span>
          </button>
          <button type="button" title="Copy to clipboard" onClick={copy}>
            <svg className="clipboard" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="clipboard__board" d="M15.666 3.888a2.25022 2.25022 0 0 0-.808-1.18262A2.25011 2.25011 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612a.74983.74983 0 0 1-.2197.53033A.74987.74987 0 0 1 15 5.25H9a.75001.75001 0 0 1-.75-.75c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5c0 .5967-.2371 1.169-.659 1.591a2.2504 2.2504 0 0 1-1.591.659H6.75a2.25023 2.25023 0 0 1-1.59099-.659A2.25015 2.25015 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.21804 48.21804 0 0 1 1.927-.184" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path className="clipboard__paper" d="M10.75 8H7.9375C7.42 8 7 8.41067 7 8.91667v9.16663c0 .506.42.9167.9375.9167h8.125c.5175 0 .9375-.4107.9375-.9167v-1.5277M10.75 8h5.3125C16.58 8 17 8.41067 17 8.91667v7.63893" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path className="clipboard__check" pathLength="1" d="m10.125 14.1146 1.25 1.2222 2.5-3.0556" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span className="sr-only">Copy</span>
          </button>
        </div>
      </div>
    </form>
  )
}

render(<App/>, ROOT_NODE)