import C from './constants'
import { gcs, emptyActionReducer, cloneObj, depixelify } from '../lib/helpers'
import processMediaContentMaxSizes from './processMediaContentMaxSizes'

const onWindowResizeReq = PopupComp => {
  const newRenderSettings = cloneObj(PopupComp.state.renderSettings)
  if (PopupComp.props.overlayState.status === 'opened') {
    const { content } = newRenderSettings.popup.childs.media
    content.status = 'resize'

    let mediaContentDOMEl = PopupComp.self.current.querySelectorAll('.pic')[0].firstChild
    const { maxWidth, maxHeight } = processMediaContentMaxSizes(PopupComp)
    mediaContentDOMEl.style.maxWidth = maxWidth
    mediaContentDOMEl.style.maxHeight = maxHeight
    const newPopupSizes = {
      width: depixelify(gcs(mediaContentDOMEl).getPropertyValue('width')),
      height: depixelify(gcs(mediaContentDOMEl).getPropertyValue('height'))
    }

    return {
      newState: { renderSettings: newRenderSettings },
      callback: () => PopupComp.performAction(C.ON_MEDIA_CONTENT_SIZES_BONDED.req, newPopupSizes, 'resize')
    }
  } else {
    newRenderSettings.popup.childs.media.content.style = {
      ...newRenderSettings.popup.childs.media.content.style,
      ...processMediaContentMaxSizes(PopupComp)
    }
    return {
      ...emptyActionReducer,
      newState: { renderSettings: newRenderSettings }
    }
  }
}

export default onWindowResizeReq
