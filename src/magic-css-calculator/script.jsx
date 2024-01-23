import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.querySelector('#app')

const App = () => {
  const moves = 8
  return (
    <form className="calculator">
      {new Array(moves).fill(0).map((_, index) => (
        <div className="calculator__move" data-move={index}>
          {new Array(10).fill(0).map((_, digit) => (
            <>
              <input id={`d-${index}-${digit}`} type="radio" data-symbol={digit} name={`d-${index}`} />
              <label for={`d-${index}-${digit}`}>{digit}</label>   
            </>
          ))}
        </div>
      ))}
      <div className="calculator__operands">
        <input id="o-divide" type="radio" name="operand" />
        <label for="o-divide">÷</label>
        <input id="o-multiply" type="radio" name="operand" />
        <label for="o-multiply">×</label>   
        <input id="o-minus" type="radio" name="operand" />
        <label for="o-minus">-</label>   
        <input id="o-plus" type="radio" name="operand" />
        <label for="o-plus">+</label>
      </div>
      <div className="calculator__calculate">
        <input type="checkbox" id="calculate" />
        <label for="calculate">=</label>
      </div>   
      <div className="results">
        <div className="first"></div>  
        <div className="second"></div>
        <div className="output"></div>
        <div className="final"></div>
      </div>
      <button type="reset">C</button>
    </form>
  )
}

render(<App/>, ROOT_NODE)