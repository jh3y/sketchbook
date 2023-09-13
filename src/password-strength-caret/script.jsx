import zxcvbn from 'https://cdn.skypack.dev/zxcvbn'
import React from 'https://cdn.skypack.dev/react@17.2.0'
import { flushSync, render } from 'https://cdn.skypack.dev/react-dom@17.2.0'
// import useCaretPosition from 'https://cdn.skypack.dev/use-caret-position'

const ROOT_NODE = document.querySelector('#app')

/**
 * useCaretPosition
 * */
/**
 * returns x, y coordinates for absolute positioning of a span within a given text input
 * at a given selection point
 * @param {object} input - the input element to obtain coordinates for
 * @param {number} selectionPoint - the selection point for the input
 */
const getCaretPosition = (input, selection, pos) => {
  const { scrollLeft, scrollTop } = input
  // This provides a hook for getSelection to reuse getCaretPosition.
  const selectionPoint = input[selection] || pos || input.selectionStart
  const { height, width, left, top } = input.getBoundingClientRect()
  // create a dummy element that will be a clone of our input
  const div = document.createElement('div')
  // get the computed style of the input and clone it onto the dummy element
  const copyStyle = getComputedStyle(input)
  for (const prop of copyStyle) {
    div.style[prop] = copyStyle[prop]
  }
  // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>
  const swap = '.'
  const inputValue =
    input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value
  // set the div content to that of the textarea up until selection
  const textContent = inputValue.substr(0, selectionPoint)
  // set the text content of the dummy element div
  div.textContent = textContent
  if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
  // if a single line input then the div needs to be single line and not break out like a text area
  if (input.tagName === 'INPUT') div.style.width = 'auto'
  // Apply absolute positioning to account for textarea resize, etc.
  div.style.position = 'absolute'
  // create a marker element to obtain caret position
  const span = document.createElement('span')
  // give the span the textContent of remaining content so that the recreated dummy element is as close as possible
  span.textContent = inputValue.substr(selectionPoint) || '.'
  // append the span marker to the div
  div.appendChild(span)
  // append the dummy element to the body
  document.body.appendChild(div)
  // get the marker position, this is the caret position top and left relative to the input
  const { offsetLeft: spanX, offsetTop: spanY } = span
  // lastly, remove that dummy element
  // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
  document.body.removeChild(div)
  // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input
  let x = left + spanX
  let y = top + spanY
  const { lineHeight, paddingRight } = copyStyle
  x = Math.min(x - scrollLeft, left + width - parseInt(paddingRight, 10))
  // Need to account for any scroll position for the window.
  y =
    Math.min(y - scrollTop, top + height - parseInt(lineHeight, 10)) +
    window.scrollY
  return {
    x,
    y,
    height,
    width,
    left,
    top,
  }
}

const getSelectionPosition = (input) => {
  const { y: startY, x: startX } = getCaretPosition(input, 'selectionStart')
  const { x: endX } = getCaretPosition(input, 'selectionEnd')
  // Gives you a basic left position for where to put it and the starting position.
  const x = startX + (endX - startX) / 2
  const y = startY
  return {
    x,
    y,
  }
}

const useCaretPosition = () => {
  const [position, setPosition] = React.useState(null)

  const getPosition = (element, pos) => {
    if (element.current) {
      const position = getCaretPosition(element.current, undefined, pos)
      setPosition(position)
      return position
    }
  }

  const getSelection = (element) => {
    if (element.current) {
      const position = getSelectionPosition(element.current)
      setPosition(position)
      return position
    }
  }

  return { ...position, getPosition, getSelection }
}
/**
 * end useCaretPosition
 * */
const STRENGTH_REQUIREMENT = 4
const App = () => {
  const inputRef = React.useRef(null)
  const [dirty, setDirty] = React.useState(false)
  const [strength, setStrength] = React.useState(0)
  const [focussed, setFocussed] = React.useState(false)
  const { x, left, getPosition, getSelection } = useCaretPosition()

  const update = () => {
    // zxcvbn provides a score from 0-4 with 0 being the worst...
    const { score } = zxcvbn(inputRef.current.value)
    setStrength(score)
    setDirty(inputRef.current.value.trim() === '' ? false : true)
  }

  const onInput = () => {
    const input = inputRef.current
    if (input) {
      getPosition(inputRef, input.value.length)
      if (!document.startViewTransition) update()
      document.startViewTransition(() => {
        flushSync(update)
      })
    }
  }

  const focus = () => {
    setFocussed(true)
  }

  const blur = () => {
    setFocussed(false)
  }

  const onFocus = () => {
    if (!document.startViewTransition) focus()
    document.startViewTransition(() => {
      flushSync(focus)
    })
  }

  const onBlur = () => {
    if (!document.startViewTransition) blur()
    document.startViewTransition(() => {
      flushSync(blur)
    })
  }

  React.useEffect(() => {
    if (inputRef.current) getPosition(inputRef)
  }, [])

  return (
    <main>
      <div className="form-group">
        <label htmlFor="password">
          <span>Password</span>
          <span>{`${Math.floor(strength * 2.5)}/10`}</span>
        </label>
        <div
          className={`input-wrapper ${dirty ? 'input-wrapper--dirty' : ''} ${
            strength >= STRENGTH_REQUIREMENT ? 'input-wrapper--valid' : ''
          }`}
        >
          <input
            spellCheck={false}
            id="password"
            ref={inputRef}
            type="password"
            onInput={onInput}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <span
            aria-hidden="true"
            className={`caret ${dirty ? 'caret--dirty' : ''} ${
              focussed ? 'caret--focussed' : ''
            }`}
            style={{ '--x': x - left, '--strength': strength * 25 }}
          >
            <span className="progress"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </div>
      </div>
    </main>
  )
}

render(<App />, ROOT_NODE)
