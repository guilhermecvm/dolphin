import React, { Component } from 'react'
import LiveCodeMirror from './components/LiveCodeMirror'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <LiveCodeMirror value={value} />
      </div>
    )
  }
}

export default App

const value = `# Dolphin note app
============================

## Image
![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png) ![Image of Dinotocat](https://octodex.github.com/images/dinotocat.png) [![Image of Catstello](https://octodex.github.com/images/catstello.png)](http://github.com)

## Styles

**bold**
*italic*
~~Mistaken text.~~

## Fenced code blocks (and syntax highlighting)

\`inline block\`

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5]
const even = numbers.filter(n => n % 2 === 0)
\`\`\`

## Task Lists

- [ ] Incomplete task list item
- [x] **Completed** task list item

* item 1
* item 2

See http://github.github.com/github-flavored-markdown/.
`
