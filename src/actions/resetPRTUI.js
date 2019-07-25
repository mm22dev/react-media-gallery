import { cloneObj, hide, fadeOut } from '../lib/helpers'
import processMediaContentMaxSizes from './processMediaContentMaxSizes'

const resetPRTUI = PopupComp => {
  const newRenderSettings = cloneObj(PopupComp.state.renderSettings)
  const { popup } = newRenderSettings
  const { loader, caption, closer, media, navbar } = popup.childs

  loader.animate = false
  media.content.style = { ...media.content.style, ...processMediaContentMaxSizes(PopupComp) }
  hide([closer, navbar.prev, navbar.next, media.wrapper])
  fadeOut([loader, caption], 0)
  return newRenderSettings
}

export default resetPRTUI
