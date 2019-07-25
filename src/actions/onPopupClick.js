import C from './constants'
import { emptyActionReducer } from '../lib/helpers'

const onPopupClick = (PopupComp, ev) => {
  ev.stopPropagation()
  if (PopupComp.popupSettings.usePopupEasyClose) {
    ev.preventDefault()
    return {
      ...emptyActionReducer,
      callback: () => PopupComp.performAction(C.ON_PRT_CLOSE.req)
    }
  } else {
    return emptyActionReducer
  }
}

export default onPopupClick
