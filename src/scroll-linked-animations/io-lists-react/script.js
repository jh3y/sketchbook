import React from 'react'
import { createRoot } from 'react-dom/client'

const DEFAULT_COUNT = 256
const OPTIONS = {
  rootMargin: '0px',
  threshold: 0
}

const ROOT = createRoot(document.querySelector('#app'))

const STYLES = ['Grid', 'List', 'Horizontal', 'Zipper', 'Rotater', 'Slidey']


const ObserverList = ({ children, options, format }) => {
  const observerRef = React.useRef(null)
  const observeRef = React.useRef(null)
  const itemsRef = React.useRef(null)
  React.useEffect(() => {
    if (observeRef.current && itemsRef.current.length) {
      itemsRef.current.forEach(item => observeRef.current.unobserve(item))
    }
    const items = [...observerRef.current.children]
    
    itemsRef.current = items
    
    const handleIntersection = (entries, observer) => {
      for (const entry of entries) entry.target.style.setProperty('--shown', entry.isIntersecting ? 1 : 0)
    }
    
    if (!observeRef.current) {
      observeRef.current = new IntersectionObserver(handleIntersection, {root: observerRef.current, ...options})
    }
    
    items.forEach(item => {
      observeRef.current.observe(item)
    })
    
    return () => {
      if (observeRef.current && itemsRef.current.length) {
        itemsRef.current.forEach(item => observeRef.current.unobserve(item))
      }
    }
  }, [children])

  return (
    <ul ref={observerRef} className={format}>
      {children}
    </ul>
  )
}

const ObserverItem = ({ format }) => (
  <li>
    <div className="card elevated"></div>
  </li>
)


const App = () => {
  const [count, setCount] = React.useState(DEFAULT_COUNT)
  const [style, setStyle] = React.useState('horizontal')
  const controlsRef = React.useRef(null)

  const handleStyleChange = e => {
    setStyle(e.target.value)
  }

  // Use event delegation for the radio button change
  React.useEffect(() => {
    controlsRef.current.addEventListener('change', handleStyleChange)
    return () => {
      controlsRef.current.removeEventListener('change', handleStyleChange)
    }
  }, [])

  return (
    <>
      <ObserverList options={OPTIONS} format={style}>
        {new Array(count).fill().map((tile, index) => (
          <ObserverItem key={index} format={style} />
        ))}
      </ObserverList>
      <div ref={controlsRef} className="controls card elevated filled">
        <div className="actions">
          {STYLES.map((style, index) => (
            <React.Fragment key={index}>
              <label htmlFor={style.toLowerCase()}>{style}</label>
              <input defaultChecked type="radio" name="style" value={style.toLowerCase()} id={style.toLowerCase()} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  )
}

ROOT.render(<App/>)