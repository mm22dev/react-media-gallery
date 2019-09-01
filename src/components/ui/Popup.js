import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import { connectWithPopupSettings } from '../../providers/PopupSettings'
import initData from '../../data/popupDefaultData.json'
import C from '../../actions/constants'
import getAction from '../../actions/index'
import Loader from './Loader'
import Media from './Media'
import Caption from './Caption'
import Closer from './Closer'
import Navbar from './Navbar'
import { pixelify, identityFn, S, getHeight, PRTError } from '../../lib/helpers'
import isEqual from 'lodash.isequal'
import { Spring } from 'react-spring/renderprops'

class PopupUI extends Component {
  constructor (props) {
    super(props)
    this.self = createRef()
    this.popupSettings = this.props.popupSettings
    const { usePopupDefaultStyling, popupBackgroundColor, popupTextColor, popupPadding, popupCaptionHeight, usePopupCaption, popupWidth, popupHeight } = this.popupSettings
    this.style = {
      display: 'none',
      verticalAlign: 'middle',
      position: 'relative',
      zIndex: 1,
      cursor: 'pointer',
      ...(usePopupDefaultStyling && {
        background: popupBackgroundColor,
        color: popupTextColor,
        padding: pixelify(popupPadding)
      }),
      ...(usePopupDefaultStyling && usePopupCaption && { paddingBottom: pixelify(popupCaptionHeight) }),
      minWidth: pixelify(popupWidth),
      minHeight: pixelify(popupHeight)
    }
    this.state = {
      springAnimationSettings: initData.springAnimationSettings.default,
      renderSettings: initData.renderSettings,
      structureSettings: initData.structureSettings
    }
    this.handleErrors = this.handleErrors.bind(this)
    this.performAction = this.performAction.bind(this)
    this.getLoaderContentMarginTop = this.getLoaderContentMarginTop.bind(this)
    this.getSpringAnimationSettings = this.getSpringAnimationSettings.bind(this)
    this.onWindowResize = () => this.performAction(C.ON_WINDOW_RESIZE_REQ.req)
    this.onKeyDown = ev => this.performAction(C.ON_KEY_DOWN.req, ev)
  }

  handleErrors (errors) {
    try {
      if (errors.length > 0) { throw new PRTError(errors[0]) }
    } catch (err) {
      errors.shift()
      this.setState(prevState => ({
        structureSettings: {
          ...prevState.structureSettings,
          errors
        }
      }), console.error(err))
    }
  }

  performAction (action, ...args) {
    let { newState, callback } = getAction(action)(this, ...args)
    callback = callback !== null ? callback : identityFn

    newState !== null
      ? this.setState(prevState => ({
        ...prevState,
        ...newState
      }), callback)
      : callback()
  }

  getLoaderContentMarginTop () {
    const DOMref = this.self.current
    const { popupCaptionSelector, popupLoaderSelector } = this.popupSettings
    const computedPopupHeight = getHeight(DOMref)
    const computedCaptionHeight = getHeight(
      S(popupCaptionSelector, DOMref) !== null
        ? S(popupCaptionSelector, DOMref)[0]
        : null
    )
    const computedLoaderContentHeight = getHeight(
      S(`${popupLoaderSelector} div`, DOMref) !== null
        ? S(`${popupLoaderSelector} div`, DOMref)[0]
        : null
    )
    return Math.floor((computedPopupHeight - computedLoaderContentHeight + computedCaptionHeight) / 2)
  }

  getSpringAnimationSettings () {
    const { triggerAnimation, duration, immediate, sizes } = this.state.springAnimationSettings
    const mediaContentStatus = this.state.renderSettings.popup.childs.media.content.status

    return {
      from: triggerAnimation ? this.state.renderSettings.popup.prevSizes : sizes,
      to: sizes,
      config: { duration: duration },
      immediate: immediate,
      onRest: () => triggerAnimation && mediaContentStatus !== 'resize'
        ? this.performAction(C.ON_POPUP_SIZES_ANIMATION_END.req, initData.springAnimationSettings.default, sizes)
        : mediaContentStatus === 'loaded'
          ? this.performAction(C.ON_MEDIA_CONTENT_APPEAR_REQ.req)
          : identityFn
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState)
  }

  componentDidUpdate (prevProps) {
    const hasOverlayStateChanged = !isEqual(prevProps.overlayState, this.props.overlayState)
    const overlayStatusList = {
      opening: () => this.state.structureSettings.queue[this.props.overlayState.anchorIndex] !== null
        ? this.performAction(C.ON_PRT_OPEN.req)
        : this.props.updateOverlayStateWith({ status: 'closed' }),
      opened: () => this.performAction(C.ON_PRT_SWITCH.req, this.props.overlayState.anchorIndex, true),
      closing: () => this.performAction(C.ON_PRT_CLOSE.req),
      closed: () => this.performAction(C.ON_OVERLAY_FADE_OUT_END.req),
      refreshing: () => this.performAction(C.ON_QUEUE_GENERATION.req, this.props.updateOverlayStateWith, true),
      refreshed: () => this.props.updateOverlayStateWith({
        status: 'opening',
        anchorIndex: this.props.getClickedAnchorIndex(this.props.overlayState.pendingMedia),
        pendingMedia: null
      })
    }
    const callbackOnUpdate = (this.props.overlayState.status in overlayStatusList) && hasOverlayStateChanged
      ? overlayStatusList[this.props.overlayState.status]
      : identityFn
    callbackOnUpdate()
    this.handleErrors([...this.state.structureSettings.errors])
  }

  render () {
    const { popup } = this.state.renderSettings
    const { childs } = popup
    const popupStyle = { ...this.style, ...popup.style }
    const springAnimationSettings = { ...this.getSpringAnimationSettings() }
    const { animate } = this.state.renderSettings.popup.childs.loader

    return (
      <Spring {...springAnimationSettings}>
        {
          springProps => (
            <div className={`prt-p-default ${this.popupSettings.popupClass}`} style={{ ...popupStyle, ...springProps }} onClick={ev => this.performAction(C.ON_POPUP_CLICK.req, ev)} ref={this.self} >
              <Loader {...childs.loader} {...(animate && { innerMarginTop: this.getLoaderContentMarginTop() })} />
              <Media {...childs.media} structureSettings={this.state.structureSettings} actionPerformer={this.performAction} />
              <Caption {...childs.caption} />
              <Closer {...childs.closer} updateOverlayStateWith={this.props.updateOverlayStateWith} />
              <Navbar {...childs.navbar} actionPerformer={this.performAction} />
            </div>
          )
        }
      </Spring>
    )
  }

  componentDidMount () {
    this.performAction(C.ON_QUEUE_GENERATION.req, newOverlayState => this.props.updateOverlayStateWith(newOverlayState), false)
    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('keydown', this.onKeyDown)
  }
}

PopupUI.propTypes = {
  popupSettings: PropTypes.object,
  overlayState: PropTypes.object,
  getClickedAnchorIndex: PropTypes.func,
  updateOverlayStateWith: PropTypes.func
}

PopupUI.defaultProps = {
  overlayState: {
    anchorIndex: null,
    status: 'init'
  },
  getClickedAnchorIndex: identityFn,
  updateOverlayStateWith: identityFn
}

const Popup = connectWithPopupSettings(PopupUI)
Popup.displayName = 'Popup'
export default Popup
