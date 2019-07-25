const constants = {
  ON_AJAX_MEDIA_LOADING: { req: 'onAjaxMediaLoading', desc: "Tricks the onLoad method of <Media /> component, setting the 'loaded' status." },
  ON_QUEUE_GENERATION: { req: 'onQueueGeneration', desc: 'Generates the list of media to be represented and reset the UI of the Popup.' },
  ON_MEDIA_CONTENT_STATUS_CHANGE: { req: 'onMediaContentStatusChange', desc: 'Status: idle -> ' + 'Empty media content, turn off applyFadeIn flag then call onMediaContentIdleAbandoning.\n' + 'Status: loading -> ' + 'Render new media while MediaWrapper is hiding content.\n' + 'Status: loaded -> ' + 'Re-render media content, then call onMediaContentLoaded.\n' },
  ON_MEDIA_CONTENT_APPEAR_REQ: { req: 'onMediaContentAppearReq', desc: 'Hide loader and mediaWrapper, show Caption, Close and Navs, then turn on applyFadeIn flag.' },
  ON_KEY_DOWN: { req: 'onKeyDown', desc: 'Triggers events binded to arrow and escape keys.' },
  ON_MEDIA_CONTENT_IDLE_ABANDONING: { req: 'onMediaContentIdleAbandoning', desc: 'Show Popup with loader, hide Close and Navs, update Nav cursor, then predispose loading status.' },
  ON_MEDIA_CONTENT_SIZES_BONDED: { req: 'onMediaContentSizesBonded', desc: 'Assign new springAnimation settings before making media content appear.' },
  ON_OVERLAY_FADE_OUT_END: { req: 'onOverlayFadeOutEnd', desc: 'Unlock and restore applyFadeIn to false.' },
  ON_POPUP_CLICK: { req: 'onPopupClick', desc: 'Close Popup if easy close is provided.' },
  ON_PRT_CLOSE: { req: 'onPRTClose', desc: 'Exec preliminary funcs then lock and hide popup.' },
  ON_PRT_OPEN: { req: 'onPRTOpen', desc: 'Lock and exec preliminary funcs before mediaWrapper fadeIn.' },
  ON_PRT_PREV_NEXT: { req: 'onPRTPrevNext', desc: 'Determine the next/previous media to be shown and switch to it.' },
  ON_PRT_SWITCH: { req: 'onPRTSwitch', desc: 'Lock, restore popup size, hide caption.' },
  ON_WINDOW_RESIZE_REQ: { req: 'onWindowResizeReq', desc: 'Re-render media content with updated minmax sizes.' },
  ON_POPUP_SIZES_ANIMATION_END: { req: 'onPopupSizesAnimationEnd', desc: 'Set current sizes as init sizes for the next animation cycle.' },
  ON_MEDIAWRAPPER_FADE_COMPLETE: { req: 'onMediaWrapperFadeComplete', desc: 'Unlock.' },
  ON_MEDIAWRAPPER_FADE_REQUEST: { req: 'onMediaWrapperFadeReq', desc: 'Turn on applyFadeIn flag.' }
}

export default constants
