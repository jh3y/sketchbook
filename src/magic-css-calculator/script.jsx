import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.querySelector('#app')

const App = () => {
  const moves = 4
  return (
    <form className="calculator">
      {new Array(moves).fill(0).map((_, index) => (
        <div className="calculator__move" data-move={index}>
          {new Array(10).fill(0).map((_, digit) => (
            <>
              <input id={`d-${index}-${digit}`} type="checkbox" className="calculator__digit" />
              <label for={`d-${index}-${digit}`}>{digit}</label>   
            </>
          ))}
        </div>
      ))}
      <div className="calculator__operands">
        <input id="o-plus" type="checkbox" className="calculator__operand" />
        <label for="o-plus">+</label>   
        <input id="o-minus" type="checkbox" className="calculator__operand" />
        <label for="o-minus">-</label>   
        <input id="o-multiply" type="checkbox" className="calculator__operand" />
        <label for="o-multiply">×</label>   
        <input id="o-divide" type="checkbox" className="calculator__operand" />
        <label for="o-divide">÷</label>   
      </div>
      {new Array(moves).fill(0).map((_, index) => (
        <div className="calculator__move" data-move={index}>
          {new Array(10).fill(0).map((_, digit) => (
            <>
              <input id={`d-${index}-${digit}`} type="checkbox" className="calculator__digit" />
              <label for={`d-${index}-${digit}`}>{digit}</label>   
            </>
          ))}
        </div>
      ))}
      <div className="first"></div>  
      <div className="second"></div>
      <div className="output"></div>
      <button type="reset">Reset</button>    
    </form>
  )
}

render(<App/>, ROOT_NODE)