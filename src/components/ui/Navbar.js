import React from 'react'
import PropTypes from 'prop-types'
import { connectWithPopupSettings } from '../../providers/PopupSettings'
import C from '../../actions/constants'
import { identityFn } from '../../lib/helpers'

const NavbarUI = ({ prev, next, popupSettings, actionPerformer }) => {
  const { usePopupDefaultStyling, usePopupEasyClose, popupNavPreviousSelector, popupNavNextSelector } = popupSettings

  const innerStyle = {
    ...(usePopupDefaultStyling && {
      position: 'absolute',
      height: '100px',
      width: '125px',
      top: '50%',
      marginTop: '-50px'
    })
  }

  const wrapperStyle = {
    ...(usePopupDefaultStyling && {
      fontSize: '75px',
      textAlign: 'center',
      color: '#fff',
      textShadow: 'none',
      height: '100%',
      position: 'absolute',
      top: 0,
      width: usePopupEasyClose ? '100px' : '75%',
      opacity: '0.35',
      cursor: 'pointer',
      boxShadow: 'inset 0px 0px 10px 0px rgba(0,0,0,0)'
    }),
    display: 'none'
  }

  const onClick = (ev, direction) => {
    ev.stopPropagation()
    ev.preventDefault()
    actionPerformer(C.ON_PRT_PREV_NEXT.req, direction)
  }

  const prevUnicode = '\u003c'
  const nextUnicode = '\u003e'

  return (
    <React.Fragment>
      {
        // PopupSettings provider sets popupNavPreviousSelector to null if usePopupNav is false
        popupNavPreviousSelector
          ? <div className={`${popupNavPreviousSelector.slice(1)}`} style={{ ...wrapperStyle, left: 0, ...prev.style }} onClick={ev => onClick(ev, 'prev')}>
            { usePopupDefaultStyling ? <div style={{ ...innerStyle, left: 0 }}>{prevUnicode}</div> : null }
          </div>
          : null
      }
      {
        // PopupSettings provider sets popupNavNextSelector to null if usePopupNav is false
        popupNavNextSelector
          ? <div className={`${popupNavNextSelector.slice(1)}`} style={{ ...wrapperStyle, right: 0, ...next.style }} onClick={ev => onClick(ev, 'next')}>
            { usePopupDefaultStyling ? <div style={{ ...innerStyle, right: 0 }}>{nextUnicode}</div> : null }
          </div>
          : null
      }

    </React.Fragment>
  )
}

NavbarUI.propTypes = {
  prev: PropTypes.object,
  next: PropTypes.object,
  popupSettings: PropTypes.object,
  actionPerformer: PropTypes.func
}

NavbarUI.defaultProps = {
  prev: { style: {} },
  next: { style: {} },
  actionPerformer: identityFn
}

const Navbar = connectWithPopupSettings(NavbarUI)
Navbar.displayName = 'Navbar'
export default Navbar
