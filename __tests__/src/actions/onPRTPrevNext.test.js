import onPRTPrevNext from '../../../src/actions/onPRTPrevNext'
import PopReactrox from '../../../src/components/PopReactrox'

const { mount } = Enzyme

describe('onPRTPrevNext', () => {
  let wrapper
  let _popupComp
  let _prevState
  let _performAction = jest.fn()
  let _result

  beforeAll(() => {
    wrapper = mount(<PopReactrox />)
    _popupComp = wrapper.find('PopupUI').instance()
    _prevState = _popupComp.state
  })

  describe('Asking for switching to next media.', () => {
    it('Prepares to switch to the media at the head of the queue.', () => {
      _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, navPos: 3, queue: ['m', 'o', 'c', 'k'] } })
      _popupComp.performAction = _performAction
      _result = onPRTPrevNext(_popupComp, 'next')
      _result.callback()
      expect(_performAction).toHaveBeenCalledWith('onPRTSwitch', 0, false)
    })

    it('Prepares to switch to next media', () => {
      _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, navPos: 0, queue: ['m', 'o', 'c', 'k'] } })
      _popupComp.performAction = _performAction
      _result = onPRTPrevNext(_popupComp, 'next')
      _result.callback()
      expect(_performAction).toHaveBeenCalledWith('onPRTSwitch', 1, false)
    })
  })

  describe('Asking for switching to previous media.', () => {
    it('Prepares to switch to previous media', () => {
      _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, navPos: 1, queue: ['m', 'o', 'c', 'k'] } })
      _popupComp.performAction = _performAction
      _result = onPRTPrevNext(_popupComp, 'prev')
      _result.callback()
      expect(_performAction).toHaveBeenCalledWith('onPRTSwitch', 0, false)
    })

    it('Prepares to switch to the media at the end of the queue.', () => {
      _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, navPos: 0, queue: ['m', 'o', 'c', 'k'] } })
      _popupComp.performAction = _performAction
      _result = onPRTPrevNext(_popupComp, 'prev')
      _result.callback()
      expect(_performAction).toHaveBeenCalledWith('onPRTSwitch', 3, false)
    })
  })

  describe('Exceeds the media that must be ignored.', () => {
    it('Prepares to switch to previous not ignored media', () => {
      _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, navPos: 2, queue: ['m', null, 'c', 'k'] } })
      _popupComp.performAction = _performAction
      _result = onPRTPrevNext(_popupComp, 'prev')
      _result.callback()
      expect(_performAction).toHaveBeenCalledWith('onPRTSwitch', 0, false)
    })

    it('Prepares to switch to next not ignored media.', () => {
      _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, navPos: 1, queue: ['m', 'o', null, 'k'] } })
      _popupComp.performAction = _performAction
      _result = onPRTPrevNext(_popupComp, 'next')
      _result.callback()
      expect(_performAction).toHaveBeenCalledWith('onPRTSwitch', 3, false)
    })
  })
})
