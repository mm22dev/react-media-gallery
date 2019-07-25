import resetPRTUI from '../../../src/actions/resetPRTUI'
import PopReactrox from '../../../src/components/PopReactrox'
import defaultPopupState from '../../../src/data/popupDefaultData.json'
import { cloneObj } from '../../../src/lib/helpers'

const { mount } = Enzyme

describe('resetPRTUI', () => {
  let _result,
    _prevState,
    _mockState

  const wrapper = mount(<PopReactrox />)
  const _popupComp = wrapper.find('PopupUI').instance()

  _mockState = cloneObj(defaultPopupState)
  const { childs } = _mockState.renderSettings.popup
  childs.loader.animate = true
  childs.closer.style = { display: 'block' }
  childs.navbar.prev.style = { display: 'block' }
  childs.navbar.next.style = { display: 'block' }
  childs.media.wrapper.style = { display: 'block' }

  _popupComp.setState({ renderSettings: _mockState.renderSettings })
  _prevState = _popupComp.state

  it('Restores popups inner component settings to init values.', () => {
    _result = resetPRTUI(_popupComp)
    expect({ ..._prevState.renderSettings }).not.toEqual(_result)
    expect(_prevState.structureSettings).toEqual(_popupComp.state.structureSettings)
    expect(_prevState.springAnimationSettings).toEqual(_popupComp.state.springAnimationSettings)
  })
})
