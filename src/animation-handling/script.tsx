import { useTweaks, makeButton } from 'https://cdn.skypack.dev/use-tweaks'
import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

interface Item {
  id: string
  color: string
  landed: boolean
}

const App = () => {
  const [logs, setLogs] = React.useState<string[]>([])
  const [items, setItems] = React.useState<Item[]>([])
  const { useSetTimeout, css, js } = useTweaks({
    useSetTimeout: {
      value: false,
      label: 'Use setTimeout',
    },
    css: {
      label: 'CSS (ms)',
      min: 0,
      max: 2000,
      step: 1,
      value: 250,
    },
    js: {
      label: 'JavaScript (ms)',
      min: 0,
      max: 2000,
      step: 1,
      value: 250,
    },
    ...makeButton('Add', () => {
      const id = `item-${crypto.randomUUID()}`
      setLogs((logs: string[]) => [
        ...logs,
        `Mount: ${id.slice(0, 10)} ${new Date().toLocaleString()}`,
      ])
      setItems((items: Item[]) => [
        ...items,
        {
          id,
          color: 'hsl(320 90% 70%)',
          landed: false,
        },
      ])
    }),
  })

  const removeItem = async (id: string) => {
    // When we remove an item, it's going to animate and then we remove it from the render.
    // But, if we fire the className and then do it, we get stuck in a situation...
    const item = document.querySelector(`#${id}`)
    if (!item) return
    // @ts-ignore-next-line
    item.dataset.leaving = true
    setLogs((logs: string[]) => [
      ...logs,
      `Animating Out: ${id.slice(0, 10)} ${new Date().toLocaleString()}`,
    ])
    if (useSetTimeout) {
      setTimeout(() => {
        setLogs((logs: string[]) => [
          ...logs,
          `Unmount: ${id.slice(0, 10)} ${new Date().toLocaleString()}`,
        ])
        setItems((items: Item[]) => items.filter((i) => i.id !== id))
      }, js)
    } else {
      const animations = document
        .querySelector(`#${id}`)
        ?.getAnimations()
        .map((a) => a.finished)
      // @ts-ignore-next-line
      await Promise.allSettled(animations)
      setLogs((logs: string[]) => [
        ...logs,
        `Unmount: ${id.slice(0, 10)} ${new Date().toLocaleString()}`,
      ])
      setItems((items: Item[]) => items.filter((i) => i.id !== id))
    }
  }

  // Update CSS speed
  React.useEffect(() => {
    document.documentElement.style.setProperty('--duration', css)
  }, [css])

  React.useEffect(() => {
    const settle = async (id: string) => {
      if (useSetTimeout) {
        setTimeout(() => {
          setLogs((logs: string[]) => [
            ...logs,
            `Animated In: ${id.slice(0, 10)} ${new Date().toLocaleString()}`,
          ])
          setItems((items: Item[]) => [
            ...items.map((i) =>
              i.id === id
                ? { id, color: 'hsl(215 80% 70%)', landed: true }
                : { ...i }
            ),
          ])
        }, js)
      } else {
        // use Element.getAnimations()
        const animations = document
          .querySelector(`#${id}`)
          ?.getAnimations()
          .map((a) => a.finished)
        // @ts-ignore-next-line
        await Promise.allSettled(animations)
        setLogs((logs: string[]) => [
          ...logs,
          `Animated In: ${id.slice(0, 10)} ${new Date().toLocaleString()}`,
        ])
        setItems((items: Item[]) => [
          ...items.map((i) =>
            i.id === id
              ? { id, color: 'hsl(215 80% 70%)', landed: true }
              : { ...i }
          ),
        ])
      }
    }
    // Get the newest item in the stack and listen for it's animations.
    // Or use the setTimeout with the duration
    if (items[items.length - 1]) {
      const { id, landed } = items[items.length - 1]
      if (id && !landed) settle(id)
    }
  }, [items])

  return (
    <main>
      {logs.length ? (
        <ul className="logs">
          {logs.map((log: string, index: number) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      ) : null}
      {items.length === 0 ? (
        <h1>
          <span aria-hidden="true">Web Pro</span>
          Add/Remove items and see the control getAnimations() gives
        </h1>
      ) : null}
      <ul className="items">
        {items.length
          ? items.map(({ id, color }) => (
              <li
                className="item"
                key={id}
                id={id}
                style={{ '--color': color }}>
                <button onClick={() => removeItem(id)}>Remove</button>
              </li>
            ))
          : null}
      </ul>
    </main>
  )
}

const ROOT_NODE = document.querySelector('#app')
render(<App />, ROOT_NODE)
