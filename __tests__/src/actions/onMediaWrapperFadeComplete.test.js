import onMediaWrapperFadeComplete from '../../../src/actions/onMediaWrapperFadeComplete'
import PopReactrox from '../../../src/components/PopReactrox'
import { cloneObj } from '../../../src/lib/helpers'

const { mount } = Enzyme

describe('onMediaWrapperFadeComplete', () => {
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
    _mockState.structureSettings.isLocked = true
    _popupComp.setState({ ..._mockState })
  })

  it('Applies state changes for unlocking popup.', () => {
    _result = onMediaWrapperFadeComplete(_popupComp)
    expect(_result.newState.structureSettings).not.toEqual(_popupComp.state.structureSettings)
    expect(_result.newState.structureSettings.isLocked).toBe(false)
  })
})
