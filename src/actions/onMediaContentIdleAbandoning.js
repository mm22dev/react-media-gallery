import C from './constants'
import { fadeIn, show, hide, cloneObj, pixelify, depixelify, emptyActionReducer } from '../lib/helpers'
import processMediaContentMaxSizes from './processMediaContentMaxSizes'
import DOMPurify from 'dompurify'

const processMediaContentSizes = (selectedMediaObj, baseZIndex) => {
  let xwidth = selectedMediaObj.width
  let xheight = selectedMediaObj.height
  const windowWidth = document.documentElement.clientWidth || document.body.clientWidth
  const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
  xwidth = (xwidth.slice(-1) === '%') ? (parseInt(xwidth.substring(0, xwidth.length - 1)) / 100.00) * windowWidth : selectedMediaObj.width
  xheight = (xheight.slice(-1) === '%') ? (parseInt(xheight.substring(0, xheight.length - 1)) / 100.00) * windowHeight : selectedMediaObj.height

  return {
    position: 'relative',
    outline: 0,
    zIndex: baseZIndex + 100,
    width: pixelify(xwidth),
    height: pixelify(xheight)
  }
}

const onMediaContentIdleAbandoning = (PopupComp, anchorIndex) => {
  const newRenderSettings = cloneObj(PopupComp.state.renderSettings)
  const { popup } = newRenderSettings
  const { loader, media, caption, closer, navbar } = popup.childs
  const { baseZIndex, popupIsFixed } = PopupComp.popupSettings

  media.wrapper.style = { ...media.wrapper.style, textIndent: '-9999px', display: 'none' } // mediaWrapper hided
  const mediaContentMaxSizes = processMediaContentMaxSizes(PopupComp)
  const selectedMediaObj = PopupComp.state.structureSettings.queue[anchorIndex]
  const mediaContent = selectedMediaObj.object

  media.content.style = {
    ...media.content.style,
    position: '',
    outline: '',
    zIndex: '',
    width: '',
    height: '',
    ...(selectedMediaObj.type !== 'image' && processMediaContentSizes(selectedMediaObj, baseZIndex)),
    ...(popupIsFixed && { ...mediaContentMaxSizes })
  }

  loader.animate = true
  fadeIn([loader], 300)
  show([popup], 'inline-block')
  hide([closer, navbar.prev, navbar.next])
  caption.children = selectedMediaObj.captionText

  const newState = {
    renderSettings: newRenderSettings,
    structureSettings: {
      ...PopupComp.state.structureSettings,
      navPos: anchorIndex
    }
  }

  if (selectedMediaObj.type === 'ajax') {
    return {
      ...emptyActionReducer,
      callback: () => {
        fetch(selectedMediaObj.src)
          .then(response => response.text())
          .then(data => {
            mediaContent.innerProps.dangerouslySetInnerHTML = { __html: DOMPurify.sanitize(data) }
            newState.renderSettings.popup.childs.media.content.elToRender = mediaContent
            const dimensions = {
              width: Math.min(+selectedMediaObj.width, depixelify(mediaContentMaxSizes.maxWidth)),
              height: Math.min(+selectedMediaObj.height, depixelify(mediaContentMaxSizes.maxHeight))
            }
            PopupComp.performAction(C.ON_AJAX_MEDIA_LOADING.req, newState, dimensions)
          })
      }
    }
  } else {
    mediaContent.innerProps.src = selectedMediaObj.src
    return {
      newState: newState,
      callback: () => PopupComp.performAction(C.ON_MEDIA_CONTENT_STATUS_CHANGE.req, 'loading', { mediaContent })
    }
  }
}

export default onMediaContentIdleAbandoning
