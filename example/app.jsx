import React from 'react'
import ReactDOM from 'react-dom'

console.log('app.jsx loaded')

export function App(props) {
    console.log('App component rendered')
    return (
        <div>
            Hello world
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))