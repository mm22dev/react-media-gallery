import Navbar from '../../../../src/components/ui/Navbar'
import toJSON from 'enzyme-to-json'
import { compose } from 'redux'
import defaultPopupSettings from '../../../../src/data/popupSettings.json'

const { shallow, mount } = Enzyme

describe('<Navbar /> Component', () => {
  let { popupSettings } = defaultPopupSettings
  let wrapper

  describe('Rendering UI', () => {
    it('Renders correctly', () => {
      compose(expect, toJSON, shallow)(<Navbar />).toMatchSnapshot()
    })

    it("Does not render default arrows if Popup's default style is not provided", () => {
      wrapper = mount(<Navbar popupSettings={{ ...popupSettings, usePopupDefaultStyling: false }} />)
      const arrowSelectors = [popupSettings.popupNavPreviousSelector, popupSettings.popupNavNextSelector]
      arrowSelectors.map(s => {
        expect(wrapper.find(s).isEmptyRender()).toBe(true)
      })
    })

    it("Extends arrows wrapper to 3/4 of Popup's width when EasyClose is disabled", () => {
      wrapper = mount(<Navbar popupSettings={{ ...popupSettings, usePopupEasyClose: false }} />)
      expect(wrapper.childAt(0).childAt(0).get(0).props.style.width).toBe('75%')
      expect(wrapper.childAt(0).childAt(1).get(0).props.style.width).toBe('75%')
    })

    it('Clicking on arrow does not cause Error if callback is not provided', () => {
      wrapper = mount(<Navbar popupSettings={{ ...popupSettings, usePopupEasyClose: false }} />)
      wrapper.childAt(0).childAt(0).simulate('click')
      wrapper.childAt(0).childAt(1).simulate('click')
    })

    describe('Closing the popup', () => {
      it('Invokes callback handler', () => {
        const _switch = jest.fn()
        wrapper = mount(<Navbar popupSettings={popupSettings} actionPerformer={_switch} />)
        wrapper.childAt(0).childAt(0).simulate('click')
        expect(_switch).toHaveBeenCalled()
        expect(_switch.mock.calls[0][0]).toBe('onPRTPrevNext')
        expect(_switch.mock.calls[0][1]).toBe('prev')
      })
    })
  })
})
