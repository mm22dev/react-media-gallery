import onPRTOpen from '../../../src/actions/onPRTOpen'
import PopReactrox from '../../../src/components/PopReactrox'

const { mount } = Enzyme

describe('onPRTOpen', () => {
  let wrapper
  let _popupComp
  let _prevState
  let _result
  let _emptyActionReducer = {
    newState: null,
    callback: null
  }

  beforeAll(() => {
    wrapper = mount(<PopReactrox />)
    _popupComp = wrapper.find('PopupUI').instance()
    _prevState = _popupComp.state
  })

  it("Interrupts action's flow if popup is locked.", () => {
    _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, isLocked: true } })
    _result = onPRTOpen(_popupComp)
    expect(_result).toEqual(_emptyActionReducer)
  })

  it("Interrupts action's flow if no media are added to queue.", () => {
    _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, queue: [] } })
    _result = onPRTOpen(_popupComp)
    expect(_result).toEqual(_emptyActionReducer)
  })

  describe('Preparing the change of <Overlay /> status.', () => {
    const _updateStateWith = jest.fn()
    const _onPopupOpen = jest.fn()

    beforeAll(() => {
      wrapper = mount(<PopReactrox PRTSettings={{ useBodyOverflow: true, onPopupOpen: _onPopupOpen }} />)
      _popupComp = wrapper.find('PopupUI').instance()
      wrapper.find('OverlayUI').instance().updateStateWith = _updateStateWith
      _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, isLocked: false, queue: ['m', 'o', 'c', 'k'] } })
      _prevState = _popupComp.state
    })

    it('Unlocks popup.', () => {
      _result = onPRTOpen(_popupComp)
      _result.callback()
      expect(_result.newState.structureSettings.isLocked).not.toBe(_prevState.structureSettings.isLocked)
    })

    it("Changes body's CSS rule if it is requested to use body overflow.", () => {
      document.body.style.overflow = 'auto'
      _result = onPRTOpen(_popupComp)
      _result.callback()
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('Invokes onPopupOpen callback if provided', () => {
      _result = onPRTOpen(_popupComp)
      _result.callback()
      expect(_onPopupOpen).toHaveBeenCalled()
    })

    it('Updates Overlay status', () => {
      _result = onPRTOpen(_popupComp)
      _result.callback()
      expect(_updateStateWith).toHaveBeenCalledWith({ status: 'open' })
    })
  })
})
