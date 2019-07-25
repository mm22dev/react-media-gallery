import onMediaContentSizesBonded from '../../../src/actions/onMediaContentSizesBonded'
import PopReactrox from '../../../src/components/PopReactrox'

const { mount } = Enzyme

describe('onMediaContentSizesBonded', () => {
  let wrapper
  let _popupComp
  let _performAction = jest.fn()
  let _prevState
  let _prevSpringSizes
  let _nextSpringAnimationSettings
  let _result

  describe('Makes <Media /> content appear.', () => {
    beforeAll(() => {
      wrapper = mount(<PopReactrox PRTSettings={{ popupIsFixed: true, usePopupDefaultStyling: false }} />)
      _popupComp = wrapper.find('PopupUI').instance()
      _popupComp.performAction = _performAction
      _prevState = _popupComp.state
      _popupComp.setState({
        springAnimationSettings: {
          ..._prevState.springAnimationSettings,
          sizes: {
            width: '200px',
            height: '100px'
          }
        }
      })
    })

    it('Invokes media content appear request if no sizes change detected.', () => {
      _result = onMediaContentSizesBonded(_popupComp, { width: 200, height: 100 }, 'loading')
      _result.callback()
      expect(_performAction).toHaveBeenCalledWith('onMediaContentAppearReq')
    })
  })

  describe('Using fixed popup sizes.', () => {
    beforeAll(() => {
      wrapper = mount(<PopReactrox PRTSettings={{ popupIsFixed: true }}/>)
      _popupComp = wrapper.find('PopupUI').instance()
      _popupComp.performAction = _performAction
      _prevState = _popupComp.state
    })

    it('Changes previous popups stored sizes.', () => {
      _prevSpringSizes = _prevState.springAnimationSettings.sizes
      _result = onMediaContentSizesBonded(_popupComp, { width: 200, height: 100 }, 'loading')
      expect(_result.newState.renderSettings.popup.prevSizes).toEqual(_prevSpringSizes)
      expect(_result.newState.renderSettings.popup.prevSizes).toEqual(_prevState.renderSettings.popup.prevSizes)
    })

    describe('Using default style', () => {
      it('Resizes popup.', () => {
        _nextSpringAnimationSettings = {
          triggerAnimation: true,
          sizes: {
            width: `${200 + 2 * 10}px`,
            height: `${100 + 10 + 60}px`
          },
          duration: 0,
          immediate: true
        }
        _result = onMediaContentSizesBonded(_popupComp, { width: 200, height: 100 }, 'loading')
        expect(_result.newState.springAnimationSettings).toEqual(_nextSpringAnimationSettings)
      })
    })

    describe('Using custom style', () => {
      beforeAll(() => {
        wrapper = mount(<PopReactrox PRTSettings={{ popupIsFixed: true, usePopupDefaultStyling: false }}/>)
        _popupComp = wrapper.find('PopupUI').instance()
        _popupComp.performAction = _performAction
        _prevState = _popupComp.state
      })

      it('Resizes popup.', () => {
        _nextSpringAnimationSettings = {
          triggerAnimation: true,
          sizes: {
            width: '200px',
            height: '100px'
          },
          duration: 0,
          immediate: true
        }
        _result = onMediaContentSizesBonded(_popupComp, { width: 200, height: 100 }, 'loading')
        expect(_result.newState.springAnimationSettings).toEqual(_nextSpringAnimationSettings)
      })
    })
  })

  describe('Using dynamic popup sizes.', () => {
    beforeAll(() => {
      wrapper = mount(<PopReactrox />)
      _popupComp = wrapper.find('PopupUI').instance()
      _popupComp.performAction = _performAction
      _prevState = _popupComp.state
    })

    it('Changes previous popups stored sizes.', () => {
      _prevSpringSizes = _prevState.springAnimationSettings.sizes
      _result = onMediaContentSizesBonded(_popupComp, { width: 500, height: 300 }, 'loading')
      expect(_result.newState.renderSettings.popup.prevSizes).toEqual(_prevSpringSizes)
      expect(_result.newState.renderSettings.popup.prevSizes).toEqual(_prevState.renderSettings.popup.prevSizes)
    })

    describe('Using default style', () => {
      it('Resizes popup.', () => {
        _nextSpringAnimationSettings = {
          triggerAnimation: true,
          sizes: {
            width: `${500 + 2 * 10}px`,
            height: `${300 + 10 + 60}px`
          },
          duration: 300,
          immediate: false
        }
        _result = onMediaContentSizesBonded(_popupComp, { width: 500, height: 300 }, 'loading')
        expect(_result.newState.springAnimationSettings).toEqual(_nextSpringAnimationSettings)
      })
    })

    describe('Using custom style', () => {
      beforeAll(() => {
        wrapper = mount(<PopReactrox PRTSettings={{ usePopupDefaultStyling: false }}/>)
        _popupComp = wrapper.find('PopupUI').instance()
        _popupComp.performAction = _performAction
        _prevState = _popupComp.state
      })

      it('Resizes popup.', () => {
        _nextSpringAnimationSettings = {
          triggerAnimation: true,
          sizes: {
            width: '500px',
            height: '300px'
          },
          duration: 300,
          immediate: false
        }
        _result = onMediaContentSizesBonded(_popupComp, { width: 500, height: 300 }, 'loading')
        expect(_result.newState.springAnimationSettings).toEqual(_nextSpringAnimationSettings)
      })
    })
  })
})
