import C from './constants'
import { fadeOut, emptyActionReducer, cloneObj } from '../lib/helpers'

const onPRTSwitch = (PopupComp, anchorIndex, ignoreLock) => {
  const newRenderSettings = cloneObj(PopupComp.state.renderSettings)
  const { popup } = newRenderSettings

  if (!ignoreLock && PopupComp.state.structureSettings.isLocked) {
    return emptyActionReducer
  } else {
    fadeOut([popup.childs.caption], 0)
    return {
      newState: { renderSettings: newRenderSettings, structureSettings: { ...PopupComp.state.structureSettings, isLocked: true } },
      callback: () => PopupComp.performAction(C.ON_MEDIA_CONTENT_STATUS_CHANGE.req, 'idle', { anchorIndex })
    }
  }
}

export default onPRTSwitch
