import React from 'https://cdn.skypack.dev/react'
import gsap from 'https://cdn.skypack.dev/gsap'
import { Flip } from 'gsap/Flip'
import { flushSync, render } from 'https://cdn.skypack.dev/react-dom'

console.clear()
gsap.registerPlugin(Flip)

const ROOT_NODE = document.querySelector('#root')

const STATES = {
  CLEAN: 'clean',
  OPEN: 'open',
  SUBMITTED: 'submitted',
}

const Form = () => {
  const formRef = React.useRef(null)
  const inputRef = React.useRef(null)
  const buttonRef = React.useRef(null)
  const stateRef = React.useRef(null)
  const [state, setState] = React.useState(STATES.CLEAN)

  const transitionForm = (event) => {
    event.preventDefault()
    if (state === STATES.CLEAN) {
      // Flush state change here.
      if (!document.startViewTransition) {
        stateRef.current = Flip.getState([formRef.current, inputRef.current, buttonRef.current], {
          scale: true,
          props: "opacity,padding",
        })
        flushSync(() => setState(STATES.OPEN))
        Flip.from(stateRef.current, {
          duration: 0.4,
          nested: true,
          ease: "bounce.out",
          absolute: true,
          onComplete: () => console.info('gsap: completed this')
        });
      } else {
        document.startViewTransition(() => {
          flushSync(() => setState(STATES.OPEN))
        })
      }
      // Fallback on GSAP
    } else if (state === STATES.OPEN) {
      if (!document.startViewTransition) {
        stateRef.current = Flip.getState([formRef.current, inputRef.current, buttonRef.current], {
          scale: true,
          props: "opacity,padding",
        })
        flushSync(() => setState(STATES.SUBMITTED))
        Flip.from(stateRef.current, {
          duration: 0.4,
          nested: true,
          ease: "bounce.out",
          absolute: true,
          onComplete: () => console.info('gsap: completed this')
        });
      } else {
        document.startViewTransition(() => {
          flushSync(() => setState(STATES.SUBMITTED))
        })
      }
    }
  }

  React.useEffect(() => {
    if (state === STATES.OPEN) inputRef.current.focus()
  }, [state])

  return (
    <form ref={formRef} data-state={state} onSubmit={transitionForm}>
      <input ref={inputRef} type="email" required id="email" autoComplete="off" placeholder="Email address" />
      <button
        ref={buttonRef}
        type="button"
        onClick={transitionForm}
        // type={state !== STATES.OPEN ? 'button' : 'submit'}
        // onClick={state !== STATES.OPEN ? transitionForm : null}
      >
        <svg
          fill="none"
          shape-rendering="geometricPrecision"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          viewBox="0 0 24 24"
        >
          {state === STATES.CLEAN && (
            <g>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </g>
          )}
          {state === STATES.OPEN && (
            <g>
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              <path d="M22 2L11 13" />
            </g>
          )}
          {state === STATES.SUBMITTED && (
            <g>
              <path d="M8 11.857l2.5 2.5L15.857 9M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
            </g>
          )}
        </svg>
      </button>
    </form>
  )
}

render(<Form />, ROOT_NODE)
