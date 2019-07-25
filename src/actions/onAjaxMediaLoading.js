import C from './constants'

const onAjaxMediaLoading = (PopupComp, newState, dimensions) => ({
  newState: newState,
  callback: () => PopupComp.performAction(C.ON_MEDIA_CONTENT_STATUS_CHANGE.req, 'loaded', { dimensions, prevStatus: 'loading' })
})

export default onAjaxMediaLoading
