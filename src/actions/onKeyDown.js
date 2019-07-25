import C from './constants'
import { emptyActionReducer } from '../lib/helpers'

const processArrowKeys = (PopupComp, usePopupNav, direction) => usePopupNav
  ? {
    ...emptyActionReducer,
    callback: () => PopupComp.performAction(C.ON_PRT_PREV_NEXT.req, direction)
  }
  : emptyActionReducer

const onKeyDown = (PopupComp, ev) => PopupComp.props.overlayState.status === 'opened'
  ? ev.keyCode === 37 || ev.keyCode === 39
    ? processArrowKeys(PopupComp, PopupComp.popupSettings.usePopupNav, ev.keyCode === 37 ? 'prev' : 'next')
    : ev.keyCode === 27
      ? {
        ...emptyActionReducer,
        callback: () => PopupComp.performAction(C.ON_PRT_CLOSE.req)
      }
      : emptyActionReducer
  : emptyActionReducer

export default onKeyDown
