import onAjaxMediaLoading from './onAjaxMediaLoading'
import onKeyDown from './onKeyDown'
import onMediaContentAppearReq from './onMediaContentAppearReq'
import onMediaContentIdleAbandoning from './onMediaContentIdleAbandoning'
import onMediaContentSizesBonded from './onMediaContentSizesBonded'
import onMediaContentStatusChange from './onMediaContentStatusChange'
import onMediaWrapperFadeComplete from './onMediaWrapperFadeComplete'
import onMediaWrapperFadeReq from './onMediaWrapperFadeReq'
import onOverlayFadeOutEnd from './onOverlayFadeOutEnd'
import onPopupClick from './onPopupClick'
import onPopupSizesAnimationEnd from './onPopupSizesAnimationEnd'
import onPRTClose from './onPRTClose'
import onPRTOpen from './onPRTOpen'
import onPRTPrevNext from './onPRTPrevNext'
import onPRTSwitch from './onPRTSwitch'
import onQueueGeneration from './onQueueGeneration'
import onWindowResizeReq from './onWindowResizeReq'

const getAction = actionLabel => {
  const popupMethods = {
    onAjaxMediaLoading,
    onKeyDown,
    onMediaContentAppearReq,
    onMediaContentIdleAbandoning,
    onMediaContentSizesBonded,
    onMediaContentStatusChange,
    onMediaWrapperFadeComplete,
    onMediaWrapperFadeReq,
    onOverlayFadeOutEnd,
    onPopupClick,
    onPopupSizesAnimationEnd,
    onPRTClose,
    onPRTOpen,
    onPRTPrevNext,
    onPRTSwitch,
    onQueueGeneration,
    onWindowResizeReq
  }

  return popupMethods.hasOwnProperty(actionLabel)
    ? popupMethods[actionLabel]
    : () => ({
      newState: null,
      callback: null
    })
}

export default getAction
