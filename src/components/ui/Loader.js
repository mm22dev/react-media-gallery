import React from 'react'
import PropTypes from 'prop-types'
import { connectWithPopupSettings } from '../../providers/PopupSettings'
import { Fade } from '../_common'
import { pixelify } from '../../lib/helpers'
import styled, { keyframes } from 'styled-components'

const LoaderUI = ({ style, animate, fade, innerMarginTop, popupSettings }) => {
  const { usePopupDefaultStyling, popupLoaderSelector, popupLoaderTextSize, popupLoaderText, popupTextColor, popupHeight } = popupSettings

  const blink = keyframes`
    from { opacity: 0.05; }
    to { opacity: 0.5; } 
  `
  const LoaderContent = styled.div`
    &.animated {
      animation: ${blink} .3s alternate infinite;
    }
  `
  const defaultWrapperStyle = { ...(usePopupDefaultStyling && {
    position: 'relative',
    fontSize: popupLoaderTextSize
  }) }

  const defaultContentStyle = { ...(usePopupDefaultStyling && {
    height: `${Math.floor(popupHeight / 2)}px`,
    overflow: 'hidden',
    lineHeight: `${Math.floor(popupHeight / 2)}px`,
    textAlign: 'center',
    color: popupTextColor || '',
    ...(animate && innerMarginTop !== 0 && { marginTop: pixelify(innerMarginTop) })
  }) }

  return (
    // PopupSettings provider sets popupLoaderSelector to null if usePopupLoader is false
    popupLoaderSelector
      ? <Fade {...fade} customDisplayOnFadeOutEnd={'none'}>
        <div className={popupLoaderSelector.slice(1)} style={{ ...defaultWrapperStyle, ...style }}>
          <LoaderContent style={defaultContentStyle} className={animate && usePopupDefaultStyling ? 'animated' : 'not-animated'}>{
            popupLoaderText
          }</LoaderContent>
        </div>
      </Fade>
      : null
  )
}

LoaderUI.propTypes = {
  style: PropTypes.object,
  animate: PropTypes.bool,
  fade: PropTypes.object,
  innerMarginTop: PropTypes.number,
  popupSettings: PropTypes.object
}

LoaderUI.defaultProps = {
  style: {},
  animate: false,
  fade: { inProp: false, duration: 0, immediate: true },
  innerMarginTop: 0
}

const Loader = connectWithPopupSettings(LoaderUI)
Loader.displayName = 'Loader'
export default Loader
