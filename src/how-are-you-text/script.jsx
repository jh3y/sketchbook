import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import { useTweaks } from 'https://cdn.skypack.dev/use-tweaks'

const ROOT_NODE = document.querySelector('#app')

const App = () => {
  const h1Ref = React.useRef(null)
  const svgRef = React.useRef(null)
  const [height, setHeight] = React.useState(0)
  const [width, setWidth] = React.useState(0)
  const { color, txt, scale, speed, image, y } = useTweaks({
    txt: 'Hi, how are you?',
    color: '#764d8c',
    image: { value: 100, min: 20, max: 500, step: 1},
    scale: { value: 6, min: 0, max: 20, step: 0.1 },
    speed: { value: 2.4, min: 0.5, max: 5, step: 0.1 },
    y: { value: 0, min: -10, max: 10, step: 0.1 }
  })
  React.useEffect(() => {
    const update = () => {
      const bounds = h1Ref.current.getBoundingClientRect()
      setHeight(Math.ceil(bounds.height))
      setWidth(Math.ceil(bounds.width))
    }
    const obs = new ResizeObserver(update)
    obs.observe(h1Ref.current)
  }, [])
  return (
    <>
      <h1 ref={h1Ref} style={{ '--color': color, '--speed': speed, '--size': image }}>
        {txt}
      </h1>
      <svg xmlns="http://www.w3.org/2000/svg" ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
        <filter id="magnify">
          <feImage
            href="data:image/svg+xml,%3Csvg width='500' height='500' viewBox='0 0 500 500' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='500' height='500' fill='url(%23paint0_radial_1988_3)'/%3E%3Cdefs%3E%3CradialGradient id='paint0_radial_1988_3' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='translate(250 250) rotate(90) scale(250)'%3E%3Cstop/%3E%3Cstop offset='0.485' stop-opacity='0.78'/%3E%3Cstop offset='1' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E%0A"
            x={image * -1}
            y={y}
            width={image}
            height={height}
            id="image"
            preserveAspectRatio="none"
            result="MAP_RESULT"
            crossorigin="anonymous"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="MAP_RESULT"
            scale={scale}
          />
          <animate
            xlinkHref="#image"
            attributeName="x"
            dur={`${speed}s`}
            keyTimes="0;0.5;1"
            values={`${image * -1};${width};${width};`}
            repeatCount="indefinite"
          />
        </filter>
      </svg>
    </>
  )
}

render(<App />, ROOT_NODE)
