import resetPRTUI from './resetPRTUI'
import { hide, identityFn, emptyActionReducer, emptyMediaContent } from '../lib/helpers'

const onPRTClose = PopupComp => {
  const { usePopupForceClose, onPopupClose, useBodyOverflow } = PopupComp.popupSettings
  const newRenderSettings = resetPRTUI(PopupComp)

  if (PopupComp.state.structureSettings.isLocked && !usePopupForceClose) {
    return emptyActionReducer
  } else {
    onPopupClose ? onPopupClose() : identityFn()
    document.body.style.overflow = useBodyOverflow ? 'auto' : document.body.style.overflow

    newRenderSettings.popup.childs.media.content.elToRender = emptyMediaContent
    hide([newRenderSettings.popup])

    return {
      newState: { renderSettings: newRenderSettings, structureSettings: { ...PopupComp.state.structureSettings, isLocked: true } },
      callback: () => PopupComp.props.updateOverlayStateWith({ status: 'close' })
    }
  }
}

export default onPRTClose
