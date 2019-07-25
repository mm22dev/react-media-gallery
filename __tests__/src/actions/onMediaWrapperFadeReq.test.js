import onMediaWrapperFadeReq from '../../../src/actions/onMediaWrapperFadeReq'
import PopReactrox from '../../../src/components/PopReactrox'

const { mount } = Enzyme

describe('onMediaWrapperFadeReq', () => {
  let wrapper,
    _popupComp,
    _result

  beforeAll(() => {
    wrapper = mount(<PopReactrox />)
    _popupComp = wrapper.find('PopupUI').instance()
  })

  it('Applies state changes for fading in loaded media.', () => {
    _result = onMediaWrapperFadeReq(_popupComp)
    expect(_result.newState.renderSettings).not.toEqual(_popupComp.state.renderSettings)
    expect(_result.newState.renderSettings.popup.childs.media.wrapper.applyFadeIn).toBeTruthy()
  })
})
