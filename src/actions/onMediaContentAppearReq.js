import C from './constants'
import { cloneObj, fadeIn, fadeOut, show } from '../lib/helpers'

const onMediaContentAppearReq = PopupComp => {
  const { fadeSpeed } = PopupComp.popupSettings
  const newRenderSettings = cloneObj(PopupComp.state.renderSettings)
  const { popup } = newRenderSettings
  const { media, loader, caption, closer, navbar } = popup.childs

  loader.animate = false
  fadeOut([loader], 0)
  media.wrapper.style = { ...media.wrapper.style, textIndent: 0, display: 'none' } // mediaWrapper hided
  fadeIn([caption], fadeSpeed)
  show([closer, navbar.prev, navbar.next], '')

  return {
    newState: { renderSettings: newRenderSettings },
    callback: () => PopupComp.performAction(C.ON_MEDIAWRAPPER_FADE_REQUEST.req)
  }
}

export default onMediaContentAppearReq
