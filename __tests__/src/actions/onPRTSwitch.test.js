import onPRTSwitch from '../../../src/actions/onPRTSwitch'
import PopReactrox from '../../../src/components/PopReactrox'

const { mount } = Enzyme

describe('onPRTSwitch', () => {
  let wrapper
  let _popupComp
  let _prevState
  let _performAction = jest.fn()
  let _result
  let _emptyActionReducer = {
    newState: null,
    callback: null
  }

  beforeAll(() => {
    wrapper = mount(<PopReactrox />)
    _popupComp = wrapper.find('PopupUI').instance()
    _prevState = _popupComp.state
    _popupComp.performAction = _performAction
  })

  it('Prepares the change of <Media /> content status.', () => {
    _result = onPRTSwitch(_popupComp, 1, true)
    expect(_result.newState).not.toEqual(_prevState)
    expect(_result.newState.structureSettings.isLocked).not.toBe(_prevState.structureSettings.isLocked)
    _result.callback()
    expect(_performAction.mock.calls[0][0]).toBe('onMediaContentStatusChange')
    expect(_performAction.mock.calls[0][1]).toBe('idle')
    expect(_performAction.mock.calls[0][2]).toEqual({ anchorIndex: 1 })
  })

  it("Interrupts action's flow if popup is locked.", () => {
    _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, isLocked: true } })
    _result = onPRTSwitch(_popupComp, 1, false)
    expect(_result).toEqual(_emptyActionReducer)
  })
})
