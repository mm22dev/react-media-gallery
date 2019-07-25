import React, { Component, createContext } from 'react'
import PropTypes from 'prop-types'
import initData from '../data/popupSettings.json'
import { PRTError } from '../lib/helpers.js'

export const Context = createContext()

export class PopupSettingsProvider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      popupSettings: {
        ...initData.popupSettings,
        ...this.props.PRTSettings
      },
      errors: []
    }
    this.validatePopupSettings = this.validatePopupSettings.bind(this)
    this.handleErrors = this.handleErrors.bind(this)
  }

  validatePopupSettings () {
    const { popupSettings } = this.state
    let errors = []
    const validate = (settingsObj, expectedType) => {
      let errors = []
      for (let key in settingsObj) {
        if (typeof settingsObj[key] !== expectedType && settingsObj[key] !== null) {
          errors.push(`Invalid prop \`${key}\` of type \`${typeof settingsObj[key]}\` supplied to PopReactrox, expected \`${expectedType}\`.`)
        }
      }
      return errors
    }

    // Numbers
    const { baseZIndex, fadeSpeed, overlayOpacity, windowMargin, windowHeightPad, popupSpeed, popupWidth, popupHeight, popupPadding, popupCaptionHeight } = popupSettings
    const numbers = { baseZIndex, fadeSpeed, overlayOpacity, windowMargin, windowHeightPad, popupSpeed, popupWidth, popupHeight, popupPadding, popupCaptionHeight }
    const numErrors = validate(numbers, 'number')
    errors = numErrors.length > 0 ? [...errors, ...numErrors] : [...errors, ...[]]

    // Booleans
    const { popupIsFixed, useBodyOverflow, usePopupEasyClose, usePopupForceClose, usePopupLoader, usePopupCloser, usePopupCaption, usePopupNav, usePopupDefaultStyling, preload } = popupSettings
    const bools = { popupIsFixed, useBodyOverflow, usePopupEasyClose, usePopupForceClose, usePopupLoader, usePopupCloser, usePopupCaption, usePopupNav, usePopupDefaultStyling, preload }
    const boolErrors = validate(bools, 'boolean')
    errors = boolErrors.length > 0 ? [...errors, ...boolErrors] : [...errors, ...[]]

    // Strings
    const { overlayColor, overlayClass, popupBackgroundColor, popupTextColor, popupLoaderTextSize, popupCloserBackgroundColor, popupCloserTextColor, popupCloserTextSize, popupCaptionTextSize, popupBlankCaptionText, popupCloserText, popupLoaderText, popupClass, popupSelector, popupLoaderSelector, popupCloserSelector, popupCaptionSelector, popupNavPreviousSelector, popupNavNextSelector, selector } = popupSettings
    const strings = { overlayColor, overlayClass, popupBackgroundColor, popupTextColor, popupLoaderTextSize, popupCloserBackgroundColor, popupCloserTextColor, popupCloserTextSize, popupCaptionTextSize, popupBlankCaptionText, popupCloserText, popupLoaderText, popupClass, popupSelector, popupLoaderSelector, popupCloserSelector, popupCaptionSelector, popupNavPreviousSelector, popupNavNextSelector, selector }
    const stringErrors = validate(strings, 'string')
    errors = stringErrors.length > 0 ? [...errors, ...stringErrors] : [...errors, ...[]]

    // Functions
    const { onPopupClose, onPopupOpen } = popupSettings
    const functions = { onPopupClose, onPopupOpen }
    const fnErrors = validate(functions, 'function')
    errors = fnErrors.length > 0 ? [...errors, ...fnErrors] : [...errors, ...[]]

    // Caption
    const { caption } = popupSettings
    if (typeof caption !== 'object' && typeof caption !== 'function' && caption !== null) errors.push(`Invalid prop \`caption\` of type \`${typeof caption}\` supplied to PopReactrox, expected \`null\` or \`object\` or \`function\`.`)

    if (errors.length > 0) this.setState({ errors })
  }

  handleErrors () {
    const errors = [...this.state.errors] // create an array copy
    if (errors.length > 0) {
      const currErr = errors[0] // extract first error
      errors.shift() // remove from the head of array
      try {
        throw new PRTError(currErr)
      } catch (err) {
        this.setState({ errors }, console.error(err))
      }
    }
  }

  componentDidMount () {
    this.setState(prevState => ({
      popupSettings: {
        ...prevState.popupSettings,
        popupLoaderSelector: !prevState.popupSettings.usePopupLoader ? null : prevState.popupSettings.popupLoaderSelector,
        popupCloserSelector: !prevState.popupSettings.usePopupCloser ? null : prevState.popupSettings.popupCloserSelector,
        popupCaptionSelector: !prevState.popupSettings.usePopupCaption ? null : prevState.popupSettings.popupCaptionSelector,
        popupNavPreviousSelector: !prevState.popupSettings.usePopupNav ? null : prevState.popupSettings.popupNavPreviousSelector,
        popupNavNextSelector: !prevState.popupSettings.usePopupNav ? null : prevState.popupSettings.popupNavNextSelector
      }
    }), this.validatePopupSettings)
  }

  componentDidUpdate () {
    this.handleErrors()
  }

  render () {
    return (
      <Context.Provider value={{ ...this.state }}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

PopupSettingsProvider.propTypes = {
  PRTSettings: PropTypes.object,
  children: PropTypes.object
}

PopupSettingsProvider.defaultProps = {
  children: null
}

export const connectWithPopupSettings = Container => {
  return class HOC extends Component {
    render () {
      return <Context.Consumer>
        {(context) => <Container {...this.props} {...context} />}
      </Context.Consumer>
    }
  }
}
