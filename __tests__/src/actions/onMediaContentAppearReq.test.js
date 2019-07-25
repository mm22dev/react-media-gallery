import onMediaContentAppearReq from '../../../src/actions/onMediaContentAppearReq'
import PopReactrox from '../../../src/components/PopReactrox'

const { mount } = Enzyme

describe('onMediaContentAppearReq', () => {
  let wrapper
  let _popupComp
  let _prevState
  let _performAction = jest.fn()
  let _result

  beforeAll(() => {
    wrapper = mount(<PopReactrox />)
    _popupComp = wrapper.find('PopupUI').instance()
    _popupComp.performAction = _performAction
  })

  it('Manages the visibility of the internal components of the popup.', () => {
    _prevState = _popupComp.state
    _result = onMediaContentAppearReq(_popupComp)
    expect(_result.newState.renderSettings).not.toEqual(_prevState.renderSettings)
  })

  it('Prepares to fade in <Media /> wrapper.', () => {
    _result = onMediaContentAppearReq(_popupComp)
    _result.callback()
    expect(_performAction).toHaveBeenCalledWith('onMediaWrapperFadeReq')
  })
})
