import Popup from '../../../../src/components/ui/Popup'
import toJSON from 'enzyme-to-json'
import { compose } from 'redux'
import defaultPopupState from '../../../../src/data/popupDefaultData.json'
import defaultPopupSettings from '../../../../src/data/popupSettings.json'
import { cloneObj } from '../../../../src/lib/helpers'

jest.mock('../../../../src/components/ui/Caption')
jest.mock('../../../../src/components/ui/Closer')
jest.mock('../../../../src/components/ui/Loader')
jest.mock('../../../../src/components/ui/Media')
jest.mock('../../../../src/components/ui/Navbar')

const { shallow, mount } = Enzyme

describe('<Popup /> Component', () => {
  const { popupSettings } = defaultPopupSettings
  let wrapper
  let _performAction = jest.fn()

  describe('Rendering UI.', () => {
    it('Renders correctly.', () => {
      compose(expect, toJSON, shallow)(<Popup />).toMatchSnapshot()
    })

    it('Click does not cause Error.', () => {
      wrapper = mount(<Popup popupSettings={popupSettings} />)
      _performAction = jest.fn()
      wrapper.find('PopupUI').instance().performAction = _performAction
      wrapper.find('.prt-p-default').simulate('click')
      expect(_performAction.mock.calls[0][0]).toBe('onPopupClick')
    })

    it('Further bottom padding is added when captions are enabled.', () => {
      wrapper = mount(<Popup popupSettings={{ ...popupSettings, usePopupDefaultStyling: true, usePopupCaption: true }} />)
      expect(wrapper.find('PopupUI').instance().style.paddingBottom).toBe(`${popupSettings.popupCaptionHeight}px`)
    })

    describe('Performing actions.', () => {
      let actionPerformer
      let _mockedState = defaultPopupState
      let _prevState
      let _newState

      beforeAll(() => {
        wrapper = mount(<Popup popupSettings={{ ...popupSettings, overlayClass: 'mock-class' }} />)
        _mockedState.structureSettings.queue = ['m', 'o', 'c', 'k']
        wrapper.find('PopupUI').instance().setState({ structureSettings: _mockedState.structureSettings })
        _prevState = wrapper.find('PopupUI').instance().state
        actionPerformer = wrapper.find('PopupUI').instance().performAction
      })

      it('Does not throw Error when nonnexistent action is provided.', () => {
        actionPerformer('mock-action')
        _newState = wrapper.find('PopupUI').instance().state
        expect(cloneObj(_prevState)).toEqual(cloneObj(_newState))
      })

      it('Updates the state and invokes callback at the end.', () => {
        actionPerformer('onPRTOpen')
        _newState = wrapper.find('PopupUI').instance().state
        expect(cloneObj(_prevState)).not.toEqual(cloneObj(_newState))
        expect(_newState.structureSettings.isLocked).toBe(true)
      })
    })

    describe('Requesting loader animation.', () => {
      const _getLoaderContentMarginTop = jest.fn()
      const _popupSettings = {
        ...popupSettings,
        popupPadding: 0,
        usePopupCaption: true,
        popupCaptionHeight: 0
      }
      let _popupState

      it('innerMarginTop prop is passed to <Loader />', () => {
        wrapper = mount(<Popup popupSettings={_popupSettings} />)
        wrapper.find('PopupUI').instance().getLoaderContentMarginTop = _getLoaderContentMarginTop
        _popupState = cloneObj(defaultPopupState)
        _popupState.renderSettings.popup.childs.loader.animate = true
        wrapper.find('PopupUI').instance().setState({ ..._popupState })
        expect(_getLoaderContentMarginTop).toHaveBeenCalled()
      })

      it('innerMarginTop is conditioned by the heights of <Loader /> and <Caption />', () => {
        wrapper = mount(<Popup popupSettings={_popupSettings} />)
        expect(wrapper.find('PopupUI').instance().getLoaderContentMarginTop()).toBe(0)
      })

      it('innerMarginTop depends only on <Popup /> sizes.', () => {
        wrapper = mount(<Popup popupSettings={{ ..._popupSettings, popupCaptionSelector: '.wrong-caption-selector', popupLoaderSelector: '.wrong-loader-selector' }} />)
        expect(wrapper.find('PopupUI').instance().getLoaderContentMarginTop()).toBe(0)
      })
    })

    describe('Assigning props to <Spring />', () => {
      let _popupState,
        _performAction,
        _springAnimationSettings

      beforeAll(() => {
        _popupState = cloneObj(defaultPopupState)
        _performAction = jest.fn()
        wrapper = mount(<Popup popupSettings={popupSettings} />)
      })

      beforeEach(() => {
        _springAnimationSettings = {
          triggerAnimation: false,
          duration: 300,
          immediate: false,
          sizes: {
            width: '100px',
            height: '100px'
          }
        }
      })

      it("Popup's resizer method is invoked when required.", done => {
        _springAnimationSettings.triggerAnimation = true
        wrapper.find('PopupUI').instance().performAction = jest.fn(args => {
          _performAction(args)
          expect(_performAction.mock.calls[0][0]).toBe('onPopupSizesAnimationEnd')
          done()
        })
        wrapper.find('PopupUI').setState({ springAnimationSettings: _springAnimationSettings })
      })

      it('<Media /> content is shown when it is loaded.', done => {
        _popupState.renderSettings.popup.childs.media.content.status = 'loaded'
        wrapper.find('PopupUI').instance().performAction = jest.fn(args => {
          _performAction(args)
          expect(_performAction).toBeCalledWith('onMediaContentAppearReq')
          done()
        })
        wrapper.find('PopupUI').setState({ renderSettings: _popupState.renderSettings, springAnimationSettings: _springAnimationSettings })
      })
    })

    describe('Receiving props from parent component', () => {
      const _overlayState = {
        status: 'opening',
        anchorIndex: 0
      }

      beforeAll(() => {
        wrapper = mount(<Popup popupSettings={popupSettings} />)
        wrapper.find('PopupUI').instance().performAction = _performAction
      })

      it('Invokes the method to lock popup modal.', () => {
        wrapper.setProps({ overlayState: _overlayState })
        expect(_performAction.mock.calls[0][0]).toBe('onPRTOpen')
      })

      it('Invokes the method to start the media loading process.', () => {
        wrapper.setProps({ overlayState: { ..._overlayState, status: 'opened' } })
        expect(_performAction.mock.calls[0][0]).toBe('onPRTSwitch')
        expect(_performAction.mock.calls[0][1]).toBe(_overlayState.anchorIndex)
      })

      it('Invokes the method to close popup modal.', () => {
        wrapper.setProps({ overlayState: { ..._overlayState, status: 'closing' } })
        expect(_performAction.mock.calls[0][0]).toBe('onPRTClose')
      })

      it('Invokes the method to unlock popup modal.', () => {
        wrapper.setProps({ overlayState: { ..._overlayState, status: 'closed' } })
        expect(_performAction.mock.calls[0][0]).toBe('onOverlayFadeOutEnd')
      })

      it('Excludes the media from being shown.', () => {
        wrapper.find('PopupUI').instance().setState({
          structureSettings: {
            ...wrapper.find('PopupUI').instance().state.structureSettings,
            queue: [null]
          }
        })
        wrapper.setProps({ overlayState: _overlayState })
        expect(_performAction).not.toHaveBeenCalled()
      })

      it('Forces media queue to be regenerated.', () => {
        wrapper.setProps({ overlayState: { ..._overlayState, status: 'refreshing' } })
        expect(_performAction.mock.calls[0][0]).toBe('onQueueGeneration')
      })

      it('Forces the popup opening after media queue regeneration.', () => {
        const _updateOverlayStateWith = jest.fn()
        wrapper = mount(<Popup popupSettings={popupSettings} updateOverlayStateWith={_updateOverlayStateWith} />)
        wrapper.setProps({ overlayState: { ..._overlayState, status: 'refreshed' } })
        // updateOverlayStateWith first time is auto called by onQueueGeneration
        expect(_updateOverlayStateWith.mock.calls[1][0].status).toBe('opening')
        expect(_updateOverlayStateWith.mock.calls[1][0]).toHaveProperty('anchorIndex')
        expect(_updateOverlayStateWith.mock.calls[1][0].pendingMedia).toBe(null)
      })
    })

    describe('Mounting <Popup />', () => {
      const map = {}

      beforeAll(() => {
        window.addEventListener = jest.fn((event, cb) => {
          map[event] = cb
        })
        wrapper = mount(<Popup popupSettings={popupSettings} />)
        wrapper.find('PopupUI').instance().performAction = _performAction
      })

      it('Resize listener is added to window', () => {
        map.resize()
        expect(_performAction).toHaveBeenCalledWith('onWindowResizeReq')
      })

      it('KeyDown listener is added to window', () => {
        const _key = { key: 'Escape' }
        map.keydown(_key)
        expect(_performAction.mock.calls[0][0]).toBe('onKeyDown')
        expect(_performAction.mock.calls[0][1]).toBe(_key)
      })
    })
  })

  describe('Unomunting <Popup />', () => {
    const map = {}

    beforeAll(() => {
      window.addEventListener = jest.fn((event, cb) => {
        map[event] = cb
      })
      window.removeEventListener = jest.fn((event) => {
        delete map[event]
      })
    })

    beforeEach(() => {
      wrapper = mount(<Popup popupSettings={popupSettings} />)
    })

    it('The resize listener is appropriately removed.', () => {
      wrapper.find('PopupUI').instance().componentWillUnmount()
      expect(map).not.toHaveProperty('resize')
    })

    it('The keydown listener is appropriately removed.', () => {
      wrapper.find('PopupUI').instance().componentWillUnmount()
      expect(map).not.toHaveProperty('keydown')
    })
  })

  describe('Handling Errors.', () => {
    let _prevState

    beforeAll(() => {
      wrapper = mount(<Popup popupSettings={popupSettings} />)
      _prevState = wrapper.find('PopupUI').instance().state
    })

    it('If present, errors are thrown', () => {
      wrapper.find('PopupUI').instance().setState({
        structureSettings: {
          ..._prevState.structureSettings,
          errors: ['mock-error']
        }
      })
      expect(() => { wrapper.find('PopupUI').instance().handleErrors() }).toThrowError()
      expect(wrapper.find('PopupUI').instance().state.structureSettings.errors.length).toBe(0)
    })
  })
})
