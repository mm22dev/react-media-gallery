import C from './constants'
import { emptyMediaContent, cloneObj } from '../lib/helpers'

const onMediaContentStatusChange = (PopupComp, status, { anchorIndex, mediaContent, dimensions, prevStatus }) => {
  const newRenderSettings = cloneObj(PopupComp.state.renderSettings)
  const media = newRenderSettings.popup.childs.media
  const mediaComponentContent = {
    idle: emptyMediaContent,
    loading: mediaContent,
    loaded: media.content.elToRender
  }
  const afterSstCallback = {
    idle: () => PopupComp.performAction(C.ON_MEDIA_CONTENT_IDLE_ABANDONING.req, anchorIndex),
    loading: null,
    loaded: () => PopupComp.performAction(C.ON_MEDIA_CONTENT_SIZES_BONDED.req, dimensions, prevStatus)
  }

  media.wrapper.applyFadeIn = status === 'idle' ? false : media.wrapper.applyFadeIn
  media.content = {
    ...media.content,
    status,
    elToRender: { ...mediaComponentContent[status] }
  }

  return {
    newState: { renderSettings: newRenderSettings },
    callback: afterSstCallback[status]
  }
}

export default onMediaContentStatusChange
