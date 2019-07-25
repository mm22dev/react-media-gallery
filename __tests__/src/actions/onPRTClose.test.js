import onPRTClose from '../../../src/actions/onPRTClose'
import PopReactrox from '../../../src/components/PopReactrox'

const { mount } = Enzyme

describe('onPRTClose', () => {
  let wrapper
  let _popupComp
  let _prevState
  let _result
  let _emptyActionReducer = {
    newState: null,
    callback: null
  }
  let _overflow

  beforeAll(() => {
    wrapper = mount(<PopReactrox />)
    _popupComp = wrapper.find('PopupUI').instance()
    _prevState = _popupComp.state
  })

  it("Interrupts action's flow if popup is locked.", () => {
    _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, isLocked: true } })
    _result = onPRTClose(_popupComp)
    expect(_result).toEqual(_emptyActionReducer)
  })

  describe('Preparing the change of <Overlay /> status.', () => {
    const _updateStateWith = jest.fn()
    const _onPopupClose = jest.fn()

    beforeAll(() => {
      wrapper = mount(<PopReactrox PRTSettings={{ useBodyOverflow: true, onPopupClose: _onPopupClose }} />)
      _popupComp = wrapper.find('PopupUI').instance()
      wrapper.find('OverlayUI').instance().updateStateWith = _updateStateWith
      _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, isLocked: false } })
      _prevState = _popupComp.state
    })

    it('Locks popup.', () => {
      _result = onPRTClose(_popupComp)
      _result.callback()
      expect(_result.newState.renderSettings).not.toEqual(_prevState.renderSettings)
      expect(_result.newState.structureSettings.isLocked).not.toBe(_prevState.structureSettings.isLocked)
    })

    it("Changes body's CSS rule if it is requested to use body overflow.", () => {
      document.body.style.overflow = 'hidden'
      _result = onPRTClose(_popupComp)
      _result.callback()
      expect(document.body.style.overflow).toBe('auto')
    })

    it('Invokes onPopupClose callback if provided', () => {
      _result = onPRTClose(_popupComp)
      _result.callback()
      expect(_onPopupClose).toHaveBeenCalled()
    })

    it('Updates Overlay status', () => {
      _result = onPRTClose(_popupComp)
      _result.callback()
      expect(_updateStateWith).toHaveBeenCalledWith({ status: 'close' })
    })

    it("Does not change body's CSS rule if it is not requested to use body overflow.", () => {
      wrapper = mount(<PopReactrox />)
      _popupComp = wrapper.find('PopupUI').instance()
      _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, isLocked: false } })
      _overflow = document.body.style.overflow

      _result = onPRTClose(_popupComp)
      _result.callback()
      expect(document.body.style.overflow).toBe(_overflow)
    })

    it('Does not invokes onPopupClose callback if not provided', () => {
      _result = onPRTClose(_popupComp)
      _result.callback()
      expect(_onPopupClose).not.toHaveBeenCalled()
    })
  })
})
