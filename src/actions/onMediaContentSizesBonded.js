import C from './constants'
import { pixelify, emptyActionReducer, cloneObj } from '../lib/helpers'
import isEqual from 'lodash.isequal'

const onMediaContentSizesBonded = (PopupComp, mediaContentSizes, prevMediaContentStatus) => {
  const { popupIsFixed, popupWidth, popupHeight, popupSpeed, usePopupDefaultStyling, popupCaptionHeight, popupPadding } = PopupComp.popupSettings

  /* Not being able to assign auto sizes to Popup through the Spring Component, when Popup default style is request, these sizes must be increased
    by a quantity equal to the Popup's padding and the captionHeight */
  const horPaddingExtension = usePopupDefaultStyling ? 2 * popupPadding : 0
  const verPaddingExtension = usePopupDefaultStyling ? popupPadding + popupCaptionHeight : 0
  const newSizes = {
    fixed: { width: pixelify(+popupWidth + horPaddingExtension), height: pixelify(+popupHeight + verPaddingExtension) },
    unfixed: { width: pixelify(+mediaContentSizes.width + horPaddingExtension), height: pixelify(+mediaContentSizes.height + verPaddingExtension) }
  }
  const newRenderSettings = cloneObj(PopupComp.state.renderSettings)
  const prevPopupSizes = PopupComp.state.springAnimationSettings.sizes
  newRenderSettings.popup.prevSizes = prevPopupSizes

  const newSpringAnimSettings = {
    triggerAnimation: true,
    sizes: popupIsFixed ? { ...newSizes.fixed } : { ...newSizes.unfixed },
    duration: popupIsFixed ? 0 : popupSpeed,
    immediate: !!(popupIsFixed || prevMediaContentStatus === 'resize')
  }

  const sizeChangeDetected = !isEqual(prevPopupSizes, popupIsFixed ? { ...newSizes.fixed } : { ...newSizes.unfixed })

  return {
    ...emptyActionReducer,
    ...(sizeChangeDetected && { newState: { renderSettings: newRenderSettings, springAnimationSettings: newSpringAnimSettings } }),
    ...(!sizeChangeDetected && { callback: () => PopupComp.performAction(C.ON_MEDIA_CONTENT_APPEAR_REQ.req) })
  }
}

export default onMediaContentSizesBonded
