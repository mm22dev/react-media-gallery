import onMediaContentStatusChange from '../../../src/actions/onMediaContentStatusChange'
import PopReactrox from '../../../src/components/PopReactrox'
import { cloneObj } from '../../../src/lib/helpers'

const { mount } = Enzyme

describe('onMediaContentStatusChange', () => {
  let wrapper
  let _popupComp
  let _mockState
  let _prevState
  let _performAction = jest.fn()
  let _result

  const _emptyMediaContent = {
    tagFamily: null,
    innerProps: {}
  }

  describe("On 'idle' request", () => {
    beforeAll(() => {
      wrapper = mount(<PopReactrox />)
      _popupComp = wrapper.find('PopupUI').instance()
      _popupComp.performAction = _performAction
      _mockState = cloneObj(_popupComp.state)
      _mockState.renderSettings.popup.childs.media.wrapper.applyFadeIn = true
      _popupComp.setState({ ..._mockState })
    })

    it('The content of <Media /> is emptied.', () => {
      _prevState = _popupComp.state
      _result = onMediaContentStatusChange(_popupComp, 'idle', { anchorIndex: 5 })
      expect(_result.newState.renderSettings.popup.childs.media).not.toEqual(_prevState.renderSettings.popup.childs.media)
      expect(_result.newState.renderSettings.popup.childs.media.content.elToRender).toEqual(_emptyMediaContent)
    })

    it("<Media /> is meant to abandon 'idle' status", () => {
      _result.callback()
      expect(_performAction).toHaveBeenCalledWith('onMediaContentIdleAbandoning', 5)
    })
  })

  describe("On 'loading' request", () => {
    const _mockMediaContent = {
      object: {
        tagFamily: 'img',
        innerProps: {
          key: 'mockKey',
          src: 'mockSrc',
          alt: 'mockAlt',
          style: {}
        }
      }
    }

    beforeAll(() => {
      wrapper = mount(<PopReactrox />)
      _popupComp = wrapper.find('PopupUI').instance()
      _prevState = _popupComp.state
      _popupComp.performAction = _performAction
    })

    it('Only media content status is updated.', () => {
      _result = onMediaContentStatusChange(_popupComp, 'loading', { mediaContent: _mockMediaContent })
      expect(_result.newState.renderSettings.popup.childs.media.content).not.toEqual(_prevState.renderSettings.popup.childs.media.content)
      delete _result.newState.renderSettings.popup.childs.media
      delete _prevState.renderSettings.popup.childs.media
      expect(_result.newState.renderSettings).toEqual(_prevState.renderSettings)
      expect(_result.callback).toBe(null)
    })
  })

  describe("On 'loaded' request", () => {
    const _mockSizes = {
      dimensions: {
        width: '200px',
        height: '100px'
      }
    }

    beforeAll(() => {
      wrapper = mount(<PopReactrox />)
      _popupComp = wrapper.find('PopupUI').instance()
      _prevState = _popupComp.state
      _popupComp.performAction = _performAction
    })

    it('Media content is shown.', () => {
      _result = onMediaContentStatusChange(_popupComp, 'loaded', { ..._mockSizes, prevStatus: 'loading' })
      expect(_result.newState.renderSettings).not.toEqual(_prevState.renderSettings)
      delete _result.newState.renderSettings.popup.childs.media.content.status
      delete _prevState.renderSettings.popup.childs.media.content.status
      expect(_result.newState.renderSettings).toEqual(_prevState.renderSettings)
      _result.callback()
      expect(_performAction).toHaveBeenCalledWith('onMediaContentSizesBonded', { width: '200px', height: '100px' }, 'loading')
    })
  })
})
