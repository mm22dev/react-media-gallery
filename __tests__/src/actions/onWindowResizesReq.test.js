import onWindowResizeReq from '../../../src/actions/onWindowResizeReq'
import PopReactrox from '../../../src/components/PopReactrox'
import defaultPopupState from '../../../src/data/popupDefaultData.json'
import { cloneObj } from '../../../src/lib/helpers'

const { mount } = Enzyme

describe('onWindowResizeReq', () => {
  let wrapper
  let _popupComp
  let _prevState
  let _mockPopupState
  let _performAction = jest.fn()
  let _result

  beforeAll(() => {
    wrapper = mount(<PopReactrox />)
    _popupComp = wrapper.find('PopupUI').instance()
    _popupComp.performAction = _performAction
  })

  it('Prepares to change <Media /> content max sizes.', () => {
    _result = onWindowResizeReq(_popupComp)
    expect(_result.callback).toBe(null)
  })

  it('Prepares to change <Media /> content status and max sizes.', () => {
    _mockPopupState = cloneObj(defaultPopupState)
    _mockPopupState.renderSettings.popup.childs.media.content.elToRender = {
      tagFamily: 'div',
      innerProps: {
        style: {
          width: '50px',
          height: '50px'
        }
      }
    }

    wrapper.find('OverlayUI').setState({ status: 'opened' })
    wrapper.find('PopupUI').setState({ renderSettings: _mockPopupState.renderSettings })
    _prevState = _popupComp.state
    _popupComp.performAction = _performAction
    _performAction.mockClear() // after Popup has been mounted, onPRTSwitch is called if Overlay status is 'opened'
    _result = onWindowResizeReq(_popupComp)

    expect(_result.newState.renderSettings).not.toEqual(_prevState.renderSettings)
    expect(_result.newState.renderSettings.popup.childs.media.content.status).toBe('resize')
    delete _result.newState.renderSettings.popup.childs.media.content.status
    delete _prevState.renderSettings.popup.childs.media.content.status
    expect(_result.newState.renderSettings).toEqual(_prevState.renderSettings)

    _result.callback()
    expect(_performAction.mock.calls[0][0]).toBe('onMediaContentSizesBonded')
    expect(_performAction.mock.calls[0][1]).toEqual({ width: 50, height: 50 })
    expect(_performAction.mock.calls[0][2]).toBe('resize')
  })
})
