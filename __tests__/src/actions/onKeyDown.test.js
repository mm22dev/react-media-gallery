import onKeyDown from '../../../src/actions/onKeyDown'
import PopReactrox from '../../../src/components/PopReactrox'

const { mount } = Enzyme

describe('onKeyDown', () => {
  let wrapper
  let _popupComp
  let _performAction = jest.fn()
  let _result
  let _emptyActionReducer = {
    newState: null,
    callback: null
  }
  let keyDownEvent

  beforeAll(() => {
    wrapper = mount(<PopReactrox />)
    _popupComp = wrapper.find('PopupUI').instance()
    _popupComp.performAction = _performAction
  })

  it("Interrupts action's flow if popup is not opened.", () => {
    keyDownEvent = new KeyboardEvent('keydown', { keyCode: 1 })
    _result = onKeyDown(_popupComp, keyDownEvent)
    expect(_result).toEqual(_emptyActionReducer)
  })

  describe('When popup is opened.', () => {
    beforeAll(() => {
      wrapper.find('OverlayUI').instance().setState({ status: 'opened' })
    })

    it("Interrupts action's flow if keycode is not in list.", () => {
      keyDownEvent = new KeyboardEvent('keydown', { keyCode: 1 })
      _popupComp = wrapper.find('PopupUI').instance()
      _result = onKeyDown(_popupComp, keyDownEvent)
      expect(_result).toEqual(_emptyActionReducer)
    })

    it('Click on escape key closes popup.', () => {
      keyDownEvent = new KeyboardEvent('keydown', { keyCode: 27 })
      _result = onKeyDown(_popupComp, keyDownEvent)
      _result.callback()
      expect(_performAction).toHaveBeenCalledWith('onPRTClose')
    })

    it("Interrupts action's flow if Popup doesn't use navbar.", () => {
      keyDownEvent = new KeyboardEvent('keydown', { keyCode: 37 })
      _result = onKeyDown(_popupComp, keyDownEvent)
      expect(_result).toEqual(_emptyActionReducer)
    })

    describe('When popup navbar is enabled.', () => {
      beforeAll(() => {
        wrapper = mount(<PopReactrox PRTSettings={{ usePopupNav: true }} />)
        _popupComp = wrapper.find('PopupUI').instance()
        _popupComp.performAction = _performAction
        wrapper.find('OverlayUI').instance().setState({ status: 'opened' })
      })

      it('Click on left arrow switches to previous media.', () => {
        keyDownEvent = new KeyboardEvent('keydown', { keyCode: 37 })
        _result = onKeyDown(_popupComp, keyDownEvent)
        _result.callback()
        expect(_performAction).toHaveBeenCalledWith('onPRTPrevNext', 'prev')
      })

      it('Click on right arrow switches to next media.', () => {
        keyDownEvent = new KeyboardEvent('keydown', { keyCode: 39 })
        _result = onKeyDown(_popupComp, keyDownEvent)
        _result.callback()
        expect(_performAction).toHaveBeenCalledWith('onPRTPrevNext', 'next')
      })
    })
  })
})
