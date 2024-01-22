import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import tweakpane from 'https://cdn.skypack.dev/tweakpane'
import { useTweaks } from 'https://cdn.skypack.dev/use-tweaks'
import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';

const ROOT_NODE = document.querySelector('#app')

const App = () => {
  const items = 10
  const { speed, spill } = useTweaks({
    speed: 12,
    spill: false,
  })

  const renderStamp = 12
  return (
    <div
      className="container"
      data-direction="horizontal"
      data-translate="items"
      data-spill={spill}
      style={{ '--speed': speed, '--count': items }}
    >
      <ul>
        {new Array(items).fill(0).map((item, index) => {
          return (
            <li
              key={`index-${renderStamp}--${index}`}
              style={{ '--index': index }}
            >
              <h2>{`${faker.person.firstName()} ${faker.person.lastName()}`}</h2>
              <img src={faker.image.avatar()} alt="" width="100" height="100" />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

render(<App />, ROOT_NODE)
