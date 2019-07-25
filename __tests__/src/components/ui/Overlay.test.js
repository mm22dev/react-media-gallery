import Overlay from '../../../../src/components/ui/Overlay'
import toJSON from 'enzyme-to-json'
import { compose } from 'redux'
import defaultPopupSettings from '../../../../src/data/popupSettings.json'
import { identityFn } from '../../../../src/lib/helpers'

jest.mock('../../../../src/components/ui/Popup')
const { shallow, mount } = Enzyme

describe('<Overlay /> Component', () => {
  const { popupSettings } = defaultPopupSettings
  let wrapper

  describe('Rendering UI', () => {
    it('Renders correctly', () => {
      compose(expect, toJSON, shallow)(<Overlay />).toMatchSnapshot()
    })

    it('touchMove does not cause Error.', () => {
      wrapper = mount(<Overlay popupSettings={popupSettings} />)
      wrapper.simulate('touchMove')
    })

    it('Click changes state.', () => {
      wrapper = mount(<Overlay popupSettings={popupSettings} />)
      wrapper.find('.prt-o-default').simulate('click')
      expect(wrapper.find('OverlayUI').instance().state.status).toBe('closing')
    })

    it('Propagates state updater to the child.', () => {
      wrapper = mount(<Overlay popupSettings={popupSettings} />)
      wrapper.find('OverlayUI').instance().updateStateWith({ status: 'init' })
      expect(wrapper.find('OverlayUI').instance().state.status).toBe('init')
    })
  })

  describe('On media anchor click.', () => {
    let _onMediaOpeningRequest = jest.fn()

    beforeAll(() => {
      document.body.innerHTML = '' +
      "<div class='gallery'>" +
      "<a class='mock-class' href='path/to/image1.jpg' data-prt-key='1'><img src='path/to/image1_thumbnail.jpg' /></a>" +
      "<a class='mock-class' href='path/to/image1.jpg' data-prt-key='2'><img src='path/to/image1_thumbnail.jpg' /></a>" +
      "<a class='mock-class' href='path/to/image1.jpg' data-prt-key='3'><img src='path/to/image1_thumbnail.jpg' /></a>" +
      "<a class='mock-class' href='path/to/image1.jpg' data-popreactrox='ignore' data-prt-key='4'><img src='path/to/image1_thumbnail.jpg' /></a>" +
      '</div>'
      wrapper = mount(<Overlay popupSettings={{ ...popupSettings, selector: 'a.mock-class' }} />)
      wrapper.find('OverlayUI').instance().onMediaOpeningRequest = _onMediaOpeningRequest
    })

    it("Catches anchor's index from the anchors media queue.", () => {
      const _onAnchorClick = jest.fn()
      wrapper.find('OverlayUI').instance().onAnchorClick = _onAnchorClick
      document.querySelectorAll('.gallery a')[2].click()
      const clickedAnchor = _onAnchorClick.mock.calls[0][0].target
      expect(wrapper.find('OverlayUI').instance().getClickedAnchorIndex(clickedAnchor)).toBe(2)
    })

    it('Propagates click when the target is not a media anchor.', () => {
      document.querySelectorAll('.gallery')[0].click()
      expect(_onMediaOpeningRequest).not.toHaveBeenCalled()
    })

    it('Propagates click when the target is a media anchor that have to be ignored.', () => {
      document.querySelectorAll('.mock-class')[3].click()
      expect(_onMediaOpeningRequest).not.toHaveBeenCalled()
    })

    it('Prepares to open media if no media queue changes detected. ', () => {
      wrapper = mount(<Overlay popupSettings={{ ...popupSettings, selector: 'a.mock-class' }} />)
      wrapper.find('OverlayUI').instance().setState({ mediaKeys: ['1', '2', '3', '4'] })
      document.querySelectorAll('.mock-class')[1].click()
      expect(wrapper.find('OverlayUI').instance().state).toEqual({ anchorIndex: 1, status: 'opening', pendingMedia: null, mediaKeys: ['1', '2', '3', '4'] })
    })

    it('Prepares to refresh media queue if any change detected. ', () => {
      wrapper = mount(<Overlay popupSettings={{ ...popupSettings, selector: 'a.mock-class' }} />)
      wrapper.find('OverlayUI').instance().setState({ mediaKeys: ['1', '3', '4'] })
      document.querySelectorAll('.mock-class')[0].click()
      expect(wrapper.find('OverlayUI').instance().state.anchorIndex).toBe(null)
      expect(wrapper.find('OverlayUI').instance().state.status).toBe('refreshing')
    })
  })

  describe('Generating Fade settings.', () => {
    let _makeFadeProps
    let _updateStateWith = jest.fn()
    let _onFadeComplete
    let _expectedResult
    let _receivedResult

    beforeAll(() => {
      wrapper = mount(<Overlay popupSettings={popupSettings} />)
      _makeFadeProps = wrapper.find('OverlayUI').instance().makeFadeProps
      wrapper.find('OverlayUI').instance().updateStateWith = _updateStateWith
    })

    it("Returns the correct object to be supplied to <Fade /> on 'init' status.", () => {
      _expectedResult = {
        inProp: false,
        duration: 0,
        immediate: true,
        onFadeComplete: identityFn
      }
      expect(_makeFadeProps('init')).toEqual(_expectedResult)
    })

    it("Returns the correct object to be supplied to <Fade /> on 'open' status.", () => {
      _expectedResult = {
        inProp: true,
        duration: popupSettings.fadeSpeed,
        immediate: false
      }
      _receivedResult = _makeFadeProps('open')
      _onFadeComplete = _receivedResult.onFadeComplete
      delete _receivedResult.onFadeComplete
      expect(_receivedResult).toEqual(_expectedResult)
      _onFadeComplete()
      expect(_updateStateWith).toHaveBeenCalledWith({ status: 'opened' })
    })

    it("Returns the correct object to be supplied to <Fade /> on 'close' status.", () => {
      _expectedResult = {
        inProp: false,
        duration: popupSettings.fadeSpeed,
        immediate: false
      }
      _receivedResult = _makeFadeProps('close')
      _onFadeComplete = _receivedResult.onFadeComplete
      delete _receivedResult.onFadeComplete
      expect(_receivedResult).toEqual(_expectedResult)
      _onFadeComplete()
      expect(_updateStateWith).toHaveBeenCalledWith({ status: 'closed' })
    })
  })

  describe('Mounting <Overlay />.', () => {
    let map = {}

    beforeAll(() => {
      document.addEventListener = jest.fn((event, cb) => {
        map[event] = cb
      })
      wrapper = mount(<Overlay popupSettings={popupSettings} />)
    })

    it('Adds click event listener to document.', () => {
      expect(map.click).toBe(wrapper.find('OverlayUI').instance().onDocumentClick)
    })
  })

  describe('Unomunting <Overlay />.', () => {
    let map = {}

    beforeAll(() => {
      document.addEventListener = jest.fn((event, cb) => {
        map[event] = cb
      })
      document.removeEventListener = jest.fn((event) => {
        delete map[event]
      })
      wrapper = mount(<Overlay popupSettings={popupSettings} />)
    })

    it("Removes document's click listener.", () => {
      expect(map).toHaveProperty('click')
      wrapper.find('OverlayUI').instance().componentWillUnmount()
      expect(map).toEqual({})
    })
  })
})
