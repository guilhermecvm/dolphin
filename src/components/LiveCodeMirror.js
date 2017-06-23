import React from 'react'
import CodeMirror from './CodeMirror'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import './one-dark.css'

class LiveCodeMirror extends React.Component {
  handleLoad(codemirror) {
    this.replaceImages(codemirror, {line: 0, ch: 0})
    this.replaceCheckboxes(codemirror, {line: 0, ch: 0})
  }

  handleChange(codemirror, changeObj) {
    const {from} = changeObj
    const fromStartOfLine = {...from, ch: 0}

    this.replaceImages(codemirror, fromStartOfLine)
    this.replaceCheckboxes(codemirror, fromStartOfLine)
  }

  *findPristine(codemirror, searchFrom, find) {
    const cursor = codemirror.getSearchCursor(find, searchFrom, {multiline: 'disable'})

    while (cursor.findNext()) {
      const markers = codemirror.findMarks(cursor.from(), cursor.to())

      // if marker was not created yet
      if (markers.length === 0) {
        yield cursor
      }
    }
  }

  replaceImages(codemirror, searchFrom) {
    const cursors = this.findPristine(codemirror, searchFrom, new RegExp(/!\[[^\]]*\] ?(?:\([^\)]*\))/))
    for (let cursor of cursors) {
      const from = cursor.from()
      const to = cursor.to()

      // extract src from markdown
      const markdown = codemirror.getRange(from, to)
      const matches = markdown.match(new RegExp(/!\[[^\]]*\] ?(\([^\)]*\))/))
      const src = matches[1].substring(1, matches[1].length - 1)

      const img = createImage(src)
      img.addEventListener('load', () => {
        codemirror.markText(from, to, {replacedWith: img})
      }, false)
    }
  }

  replaceCheckboxes(codemirror, searchFrom) {
    const cursors = this.findPristine(codemirror, searchFrom, new RegExp(/\[( |x)\]/))
    for (let cursor of cursors) {
      const from = cursor.from()
      const to = cursor.to()

      // extract if checkbox is selected or not
      const markdown = codemirror.getRange(from, to)
      const matches = markdown.match(new RegExp(/\[( |x)\]/))

      const checkbox = createCheckbox(matches[1] === 'x')
      const marker = codemirror.markText(from, to, {replacedWith: checkbox})

      // on change checkbox value, edit source text
      checkbox.addEventListener('change', (e) => {
        const str = e.target.checked ? '[x]' : '[ ]'
        const {from, to} = marker.find()
        codemirror.replaceRange(str, from, to)
      })
    }
  }

  render() {
    return (
      <CodeMirror
        ref='codemirror'
        mode='gfm'
        lineNumbers={true}
        theme='one-dark'
        value={this.props.value}
        onLoad={this.handleLoad.bind(this)}
        onChange={this.handleChange.bind(this)}
      />
    )
  }
}

function createImage(src) {
  const img = new Image()
  img.setAttribute('src', src)
  img.setAttribute('height', '200px')
  return img
}

function createCheckbox(checked) {
  const checkbox = document.createElement('input')
  checkbox.setAttribute('type', 'checkbox')
  checkbox.checked = checked
  return checkbox
}

export default LiveCodeMirror
