import { getWidth, getHeight, pixelify } from '../lib/helpers'

const processMediaContentMaxSizes = PopupComp => {
  const { windowHeightPad, windowMargin, popupIsFixed, popupWidth, popupHeight } = PopupComp.popupSettings
  const windowWidth = document.documentElement.clientWidth || document.body.clientWidth
  const windowHeight = document.documentElement.clientHeight || document.body.clientHeight + windowHeightPad
  const dw = Math.abs(getWidth(PopupComp.self.current) - PopupComp.self.current.offsetWidth)
  const dh = Math.abs(getHeight(PopupComp.self.current) - PopupComp.self.current.offsetHeight)
  const maxw = windowWidth - (windowMargin * 2) - dw
  const maxh = windowHeight - (windowMargin * 2) - dh

  return {
    maxWidth: pixelify(popupIsFixed ? popupWidth : maxw),
    maxHeight: pixelify(popupIsFixed ? popupHeight : maxh)
  }
}

export default processMediaContentMaxSizes
