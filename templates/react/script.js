import React from 'react'
import { createRoot } from 'react-dom/client'

const ROOT = createRoot(document.querySelector('#app'))

const App = () => {
	const [count, setCount] = React.useState(0)
	return (
		<>
			<h1>Hello World!</h1>
			{count > 0 && <h2>Count: {count}</h2>}
			<button onClick={() => setCount(count + 1)}>Click Me!</button>
		</>
	)
}

ROOT.render(<App/>)