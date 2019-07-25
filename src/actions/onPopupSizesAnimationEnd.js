import { emptyActionReducer } from '../lib/helpers'

export const onPopupSizesAnimationEnd = (PopupComp, defaultSettings, newSizes) => ({
  ...emptyActionReducer,
  newState: {
    springAnimationSettings: {
      ...defaultSettings,
      sizes: { ...newSizes }
    }
  }
})

export default onPopupSizesAnimationEnd
