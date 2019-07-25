import React from 'react'
import PropTypes from 'prop-types'
import { connectWithPopupSettings } from '../../providers/PopupSettings'
import { Fade } from '../_common'

const CaptionUI = ({ fade, style, children, popupSettings }) => {
  const { usePopupDefaultStyling, popupCaptionSelector, popupCaptionHeight, popupPadding, popupCaptionTextSize, popupBlankCaptionText } = popupSettings

  const defaultStyle = {
    ...(usePopupDefaultStyling && {
      ...(popupCaptionTextSize && { fontSize: popupCaptionTextSize }),
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      textAlign: 'center',
      height: `${popupCaptionHeight}px`,
      lineHeight: `${popupCaptionHeight}px`,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      padding: `0 ${popupPadding ? `${popupPadding}px` : 0}`
    })
  }

  const captionContent = !children || children.length === 0 ? popupBlankCaptionText : children

  return (
    // PopupSettings provider sets popupCaptionSelector to null if usePopupCaption is false
    popupCaptionSelector
      ? <Fade {...fade}>
        <div className={popupCaptionSelector.slice(1)} style={{ ...defaultStyle, ...style }} title={captionContent}>
          { captionContent }
        </div>
      </Fade>
      : null
  )
}

CaptionUI.propTypes = {
  fade: PropTypes.object,
  style: PropTypes.object,
  children: PropTypes.string,
  popupSettings: PropTypes.object
}

CaptionUI.defaultProps = {
  fade: { inProp: false, duration: 0, immediate: true },
  style: {},
  children: ''
}

const Caption = connectWithPopupSettings(CaptionUI)
Caption.displayName = 'Caption'
export default Caption
