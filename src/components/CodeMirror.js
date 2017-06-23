import React from 'react'
import PropTypes from 'prop-types'
import CM from 'codemirror'
import '../../node_modules/codemirror/lib/codemirror.css'

class CodeMirror extends React.Component {
  componentDidMount() {
    const codemirror = CM.fromTextArea(this.textarea, {
      mode: this.props.mode,
      theme: this.props.theme,
      lineNumbers: this.props.lineNumbers
    })

    codemirror.on('change', this.handleChange.bind(this))
    this.handleLoad(codemirror)
  }

  handleLoad(instance) {
    if (this.props.onLoad) {
      this.props.onLoad(instance)
    }
  }

  handleChange(instance, changeObj) {
    if (this.props.onChange) {
      this.props.onChange(instance, changeObj)
    }
  }

  render() {
    return (
      <textarea
        name={this.props.name}
        ref={(ref) => { this.textarea = ref }}
        defaultValue={this.props.value}
      />
    )
  }
}

CodeMirror.propTypes = {
  mode: PropTypes.string,
  theme: PropTypes.string,
  lineNumbers: PropTypes.bool,
  value: PropTypes.string,
  onLoad: PropTypes.func,
  onChange: PropTypes.func
}

CodeMirror.defaultProps = {
  name: 'codemirror'
}

export default CodeMirror
