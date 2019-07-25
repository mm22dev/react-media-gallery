import { emptyActionReducer, identityFn } from '../lib/helpers'

const onPRTOpen = PopupComp => {
  const { isLocked } = PopupComp.state.structureSettings
  const { useBodyOverflow, onPopupOpen } = PopupComp.popupSettings

  return isLocked
    ? emptyActionReducer
    : PopupComp.state.structureSettings.queue.length === 0
      ? emptyActionReducer
      : {
        newState: { structureSettings: { ...PopupComp.state.structureSettings, isLocked: true } },
        callback: () => {
          document.body.style.overflow = useBodyOverflow ? 'hidden' : document.body.style.overflow
          onPopupOpen ? onPopupOpen() : identityFn()
          PopupComp.props.updateOverlayStateWith({ status: 'open' })
        }
      }
}

export default onPRTOpen
