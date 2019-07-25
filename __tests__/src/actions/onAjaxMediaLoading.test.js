import onAjaxMediaLoading from '../../../src/actions/onAjaxMediaLoading'
import PopReactrox from '../../../src/components/PopReactrox'

const { mount } = Enzyme

describe('onAjaxMediaLoading', () => {
  let wrapper
  let _popupComp
  let _newState
  let dimensions
  let _performAction = jest.fn()
  let _result

  beforeAll(() => {
    wrapper = mount(<PopReactrox />)
    _popupComp = wrapper.find('PopupUI').instance()
    _popupComp.performAction = _performAction
  })

  it('Prepares to resize <Popup /> wrapper.', () => {
    dimensions = {
      width: 50,
      height: 50
    }
    _newState = {
      foo: 'foo'
    }
    _result = onAjaxMediaLoading(_popupComp, _newState, dimensions)
    expect(_result.newState).toEqual(_newState)
    _result.callback()
    expect(_performAction.mock.calls[0][0]).toBe('onMediaContentStatusChange')
    expect(_performAction.mock.calls[0][1]).toBe('loaded')
    expect(_performAction.mock.calls[0][2]).toEqual({
      dimensions: {
        width: 50,
        height: 50
      },
      prevStatus: 'loading'
    })
  })
})
