import React from 'react'
import PropTypes from 'prop-types'
import { connectWithPopupSettings } from '../../providers/PopupSettings'
import { identityFn } from '../../lib/helpers'

const CloserUI = ({ style, popupSettings, updateOverlayStateWith }) => {
  const { usePopupDefaultStyling, popupCloserText, popupCloserSelector, popupCloserTextSize, popupCloserBackgroundColor, popupCloserTextColor } = popupSettings

  const defaultStyle = {
    ...(usePopupDefaultStyling && {
      fontSize: popupCloserTextSize,
      background: popupCloserBackgroundColor,
      color: popupCloserTextColor,
      width: '40px',
      height: '40px',
      lineHeight: '40px',
      textAlign: 'center',
      position: 'absolute',
      textDecoration: 'none',
      outline: 0,
      top: 0,
      right: '-40px',
      cursor: 'pointer'
    })
  }

  const onClick = ev => {
    ev.preventDefault()
    ev.stopPropagation()
    updateOverlayStateWith({ status: 'closing' })
    return true
  }

  return (
    popupCloserSelector
      ? <span
        className={`prt-x-default ${popupCloserSelector.slice(1)}`}
        style={{ ...defaultStyle, ...style }}
        onClick={ev => onClick(ev)}
      >
        { usePopupDefaultStyling ? popupCloserText : null }
      </span>
      : null
  )
}

CloserUI.propTypes = {
  style: PropTypes.object,
  popupSettings: PropTypes.object,
  updateOverlayStateWith: PropTypes.func
}

CloserUI.defaultProps = {
  style: {},
  updateOverlayStateWith: identityFn
}

const Closer = connectWithPopupSettings(CloserUI)
Closer.displayName = 'Closer'
export default Closer
