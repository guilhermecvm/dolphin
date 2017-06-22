import React from 'react'
import CM from 'codemirror'
import gfm from 'codemirror/mode/gfm/gfm'
import markdown from 'codemirror/mode/markdown/markdown'
import javascript from 'codemirror/mode/javascript/javascript'
import search from 'codemirror/addon/search/search'
import searchcursor from 'codemirror/addon/search/searchcursor'
import '../../node_modules/codemirror/lib/codemirror.css'
import './one-dark.css'

class CodeMirror extends React.Component {
  componentDidMount() {
    const editor = CM.fromTextArea(this.textarea, {
      mode: 'gfm',
      lineNumbers: true,
      theme: 'one-dark'
    })

    this.replaceImages(editor, {line: 0, ch: 0})
    this.replaceCheckboxes(editor, {line: 0, ch: 0})

    editor.on('change', (instance, changeObj) => {
      const {from, to, text, removed, origin} = changeObj
      const fromStartOfLine = Object.assign({}, from, { ch: 0 })

      this.replaceImages(instance, fromStartOfLine)
      this.replaceCheckboxes(instance, fromStartOfLine)
    })
  }

  replaceImages(editor, from) {
    // would be better if could search between ranges
    const cursor = editor.getSearchCursor(new RegExp(/!\[[^\]]*\] ?(?:\([^\)]*\))/), from, {multiline: 'disable'})

    while (cursor.findNext()) {
      const from = cursor.from()
      const to = cursor.to()
      const markers = editor.findMarks(from, to)

      // if marker was not created yet
      if (markers.length === 0) {
        // extract src from markdown
        const markdown = editor.getRange(from, to)
        const matches = markdown.match(new RegExp(/!\[[^\]]*\] ?(\([^\)]*\))/))
        const src = matches[1].substring(1, matches[1].length-1)

        const img = createImage( src)
        img.addEventListener('load', () => {
          editor.markText(from, to, {replacedWith: img})
        }, false)
      }
    }
  }

  replaceCheckboxes(editor, from) {
    // would be better if could search between ranges
    const cursor = editor.getSearchCursor(new RegExp(/\[( |x)\]/), from, {multiline: 'disable'})

    while (cursor.findNext()) {
      const from = cursor.from()
      const to = cursor.to()
      const markers = editor.findMarks(from, to)

      if (markers.length === 0) {
        // extract if checkbox is selected or not
        const markdown = editor.getRange(from, to)
        const matches = markdown.match(new RegExp(/\[( |x)\]/))

        const checkbox = createCheckbox(matches[1] === 'x')
        const marker = editor.markText(from, to, {replacedWith: checkbox})
        checkbox.addEventListener('change', (e) => {
          const str = e.target.checked ? '[x]' : '[ ]'
          const { from, to } = marker.find()
          editor.replaceRange(str, from, to)
        })
      }
    }
  }

  render() {
    return (
      <textarea
        id="code"
        name="code"
        ref={(ref) => { this.textarea = ref }}
        defaultValue={value}
      />
    )
  }
}

function createImage(src) {
  const img = new Image()
  img.setAttribute('src', src)
  img.setAttribute('height', 200)
  return img
}

function createCheckbox(checked) {
  const checkbox = document.createElement('input')
  checkbox.setAttribute('type', 'checkbox')
  checkbox.checked = checked
  return checkbox
}

export default CodeMirror


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