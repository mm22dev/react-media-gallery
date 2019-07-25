import onPopupClick from '../../../src/actions/onPopupClick'
import PopReactrox from '../../../src/components/PopReactrox'

const { mount } = Enzyme

describe('onPopupClick', () => {
  let wrapper
  let _popupComp
  let _performAction = jest.fn()
  let _result
  let _emptyActionReducer = {
    newState: null,
    callback: null
  }

  const clickEvent = new MouseEvent('click')

  beforeAll(() => {
    wrapper = mount(<PopReactrox />)
  })

  it('Prepares to close the popup if popup easy cloes is requested.', () => {
    _popupComp = wrapper.find('PopupUI').instance()
    _popupComp.performAction = _performAction
    _result = onPopupClick(_popupComp, clickEvent)
    _result.callback()
    expect(_performAction).toHaveBeenCalledWith('onPRTClose')
  })

  it("Interrupts action's flow if popup easy cloes is not requested.", () => {
    wrapper = mount(<PopReactrox PRTSettings={{ usePopupEasyClose: false }} />)
    _popupComp = wrapper.find('PopupUI').instance()
    _result = onPopupClick(_popupComp, clickEvent)
    expect(_result).toEqual(_emptyActionReducer)
  })
})
