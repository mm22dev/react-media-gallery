import onOverlayFadeOutEnd from '../../../src/actions/onOverlayFadeOutEnd'
import PopReactrox from '../../../src/components/PopReactrox'
import { cloneObj } from '../../../src/lib/helpers'

const { mount } = Enzyme

describe('onOverlayFadeOutEnd', () => {
  let wrapper,
    _popupComp,
    _prevState,
    _mockState,
    _result

  beforeAll(() => {
    wrapper = mount(<PopReactrox />)
    _popupComp = wrapper.find('PopupUI').instance()
    _prevState = _popupComp.state
    _mockState = cloneObj(_prevState)
    _mockState.renderSettings.popup.childs.media.wrapper.applyFadeIn = true
    _mockState.structureSettings.isLocked = true
    _popupComp.setState({ ..._mockState })
  })

  it('Applies state changes for fading out loaded media and unlocks popup.', () => {
    _result = onOverlayFadeOutEnd(_popupComp)
    expect(_result.newState.renderSettings).not.toEqual(_popupComp.state.renderSettings)
    expect(_result.newState.structureSettings).not.toEqual(_popupComp.state.structureSettings)
    expect(_result.newState.renderSettings.popup.childs.media.wrapper.applyFadeIn).toBe(false)
    expect(_result.newState.structureSettings.isLocked).toBe(false)
  })
})
