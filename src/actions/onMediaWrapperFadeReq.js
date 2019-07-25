import { cloneObj, emptyActionReducer } from '../lib/helpers'

const onMediaWrapperFadeReq = PopupComp => {
  const newRenderSettings = cloneObj(PopupComp.state.renderSettings)
  newRenderSettings.popup.childs.media.wrapper.applyFadeIn = true
  return {
    ...emptyActionReducer,
    newState: { renderSettings: newRenderSettings }
  }
}

export default onMediaWrapperFadeReq
