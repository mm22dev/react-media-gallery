import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connectWithPopupSettings } from '../../providers/PopupSettings'
import { Fade } from '../_common'
import Popup from './Popup'
import isEqual from 'lodash.isequal'
import { identityFn } from '../../lib/helpers'

class OverlayUI extends Component {
  constructor (props) {
    super(props)
    this.popupSettings = this.props.popupSettings
    this.style = {
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      textAlign: 'center',
      cursor: 'pointer',
      zIndex: this.popupSettings.baseZIndex,
      display: 'none' // handled by <Fade />
    }
    this.state = {
      status: 'init',
      anchorIndex: null,
      pendingMedia: null,
      mediaKeys: []
    }
    this.getAnchorsList = this.getAnchorsList.bind(this)
    this.onDocumentClick = this.onDocumentClick.bind(this)
    this.getClickedAnchorIndex = this.getClickedAnchorIndex.bind(this)
    this.onAnchorClick = this.onAnchorClick.bind(this)
    this.onMediaOpeningRequest = this.onMediaOpeningRequest.bind(this)
    this.onOverlayClick = this.onOverlayClick.bind(this)
    this.updateStateWith = this.updateStateWith.bind(this)
    this.makeFadeProps = this.makeFadeProps.bind(this)
  }

  getAnchorsList () {
    return [...document.querySelectorAll(this.popupSettings.selector)]
  }

  onDocumentClick (ev) {
    const anchors = this.getAnchorsList()
    anchors.includes(ev.target) && ev.target.getAttribute('data-popreactrox') !== 'ignore' ? this.onAnchorClick(ev) : identityFn()
  }

  getClickedAnchorIndex (clickedAnchor) {
    const anchors = this.getAnchorsList()
    return anchors.findIndex(a => a === clickedAnchor)
  }

  onAnchorClick (ev) {
    const anchors = this.getAnchorsList()
    const currMediaKeys = anchors.map(a => a.getAttribute('data-prt-key'))
    if (isEqual(currMediaKeys, this.state.mediaKeys)) {
      const anchorIndex = this.getClickedAnchorIndex(ev.target)
      ev.preventDefault()
      this.onMediaOpeningRequest({ anchorIndex })
    } else {
      ev.preventDefault()
      this.updateStateWith({ status: 'refreshing', pendingMedia: ev.target })
    }
  }

  updateStateWith (newState) {
    this.setState(newState)
  }

  makeFadeProps (overlayStatus) {
    const inProp = { init: false, opening: false, open: true, opened: true, closing: true, close: false, closed: false }

    return {
      inProp: inProp[overlayStatus],
      duration: overlayStatus === 'open' || overlayStatus === 'close' ? this.popupSettings.fadeSpeed : 0,
      immediate: !(overlayStatus === 'open' || overlayStatus === 'close'),
      onFadeComplete: overlayStatus === 'open' || overlayStatus === 'close'
        ? () => this.updateStateWith({ status: `${overlayStatus.endsWith('e') ? `${overlayStatus}d` : `${overlayStatus}ed`}` })
        : identityFn
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state.status, nextState.status)
  }

  onMediaOpeningRequest ({ anchorIndex }) {
    this.setState({
      anchorIndex: anchorIndex,
      status: 'opening'
    })
  }

  onOverlayClick (ev) {
    ev.preventDefault()
    ev.stopPropagation()
    this.setState({ status: 'closing' })
  }

  render () {
    const { overlayClass, overlayColor, overlayOpacity } = this.popupSettings
    const fadeProps = this.makeFadeProps(this.state.status)
    return (
      <Fade {...fadeProps} customDisplayOnFadeOutEnd={'none'}>
        <div id='prt-container' className={`prt-o-default ${overlayClass}`}
          style={this.style}
          onTouchMove={identityFn}
          onClick={ev => this.onOverlayClick(ev)} >
          <div style={{
            display: 'inline-block',
            height: '100%',
            verticalAlign: 'middle' }}/>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: overlayColor,
            opacity: overlayOpacity,
            filter: `alpha(opacity=${overlayOpacity * 100})` }} />
          <Popup
            overlayState={this.state}
            getClickedAnchorIndex={this.getClickedAnchorIndex}
            updateOverlayStateWith={this.updateStateWith}
          />
        </div>
      </Fade>
    )
  }

  componentDidMount () {
    document.addEventListener('click', this.onDocumentClick)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.onDocumentClick)
  }
}

OverlayUI.propTypes = {
  popupSettings: PropTypes.shape({
    preload: PropTypes.bool,
    baseZIndex: PropTypes.number,
    fadeSpeed: PropTypes.number,
    overlayColor: PropTypes.string,
    overlayOpacity: PropTypes.number,
    windowMargin: PropTypes.number,
    windowHeightPad: PropTypes.number,
    selector: PropTypes.string,
    caption: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func
    ]),
    popupSpeed: PropTypes.number,
    popupWidth: PropTypes.number,
    popupHeight: PropTypes.number,
    popupIsFixed: PropTypes.bool,
    useBodyOverflow: PropTypes.bool,
    usePopupEasyClose: PropTypes.bool,
    usePopupForceClose: PropTypes.bool,
    usePopupLoader: PropTypes.bool,
    usePopupCloser: PropTypes.bool,
    usePopupCaption: PropTypes.bool,
    usePopupNav: PropTypes.bool,
    usePopupDefaultStyling: PropTypes.bool,
    popupBackgroundColor: PropTypes.string,
    popupTextColor: PropTypes.string,
    popupLoaderTextSize: PropTypes.string,
    popupCloserBackgroundColor: PropTypes.string,
    popupCloserTextColor: PropTypes.string,
    popupCloserTextSize: PropTypes.string,
    popupPadding: PropTypes.number,
    popupCaptionHeight: PropTypes.number,
    popupCaptionTextSize: PropTypes.string,
    popupBlankCaptionText: PropTypes.string,
    popupCloserText: PropTypes.string,
    popupLoaderText: PropTypes.string,
    popupClass: PropTypes.string,
    popupSelector: PropTypes.string,
    popupLoaderSelector: PropTypes.string,
    popupCloserSelector: PropTypes.string,
    popupCaptionSelector: PropTypes.string,
    popupNavPreviousSelector: PropTypes.string,
    popupNavNextSelector: PropTypes.string,
    onPopupClose: PropTypes.func,
    onPopupOpen: PropTypes.func
  })
}

const Overlay = connectWithPopupSettings(OverlayUI)
Overlay.displayName = 'Overlay'
export default Overlay
