import { cloneObj, emptyActionReducer } from '../lib/helpers'

const onOverlayFadeOutEnd = PopupComp => {
  const renderSettings = cloneObj(PopupComp.state.renderSettings)
  renderSettings.popup.childs.media.wrapper.applyFadeIn = false

  return {
    ...emptyActionReducer,
    newState: { renderSettings: renderSettings, structureSettings: { ...PopupComp.state.structureSettings, isLocked: false } }
  }
}

export default onOverlayFadeOutEnd
