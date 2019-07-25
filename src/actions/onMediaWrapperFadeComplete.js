import { emptyActionReducer } from '../lib/helpers'

const onMediaWrapperFadeComplete = (PopupComp, structureSettings) => ({
  ...emptyActionReducer,
  newState: {
    structureSettings: {
      ...structureSettings,
      isLocked: false
    }
  }
})

export default onMediaWrapperFadeComplete
