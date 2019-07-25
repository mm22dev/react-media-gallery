import Closer from '../../../../src/components/ui/Closer'
import toJSON from 'enzyme-to-json'
import { compose } from 'redux'
import defaultPopupSettings from '../../../../src/data/popupSettings.json'

const { shallow, mount } = Enzyme

describe('<Closer /> Component', () => {
  let { popupSettings } = defaultPopupSettings

  describe('Rendering UI', () => {
    it('Renders correctly', () => {
      compose(expect, toJSON, shallow)(<Closer />).toMatchSnapshot()
    })

    it('Clicking default close button does not cause Error', () => {
      mount(<Closer popupSettings={popupSettings} />)
        .find(popupSettings.popupCloserSelector)
        .simulate('click')
    })

    it('Renders empty Component if required', () => {
      expect(mount(<Closer popupSettings={{ ...popupSettings, popupCloserSelector: null }} />).isEmptyRender()).toBe(true)
    })

    it('Does not Apply default style if required', () => {
      expect(
        mount(<Closer popupSettings={{ ...popupSettings, usePopupDefaultStyling: false }} />)
          .find(popupSettings.popupCloserSelector)
          .get(0)
          .props
          .style
      ).toEqual({})
    })
  })

  describe('Closing the popup', () => {
    it('Invokes callback handler', () => {
      const _close = jest.fn()
      mount(<Closer popupSettings={popupSettings} updateOverlayStateWith={_close} />)
        .find(popupSettings.popupCloserSelector)
        .simulate('click')
      expect(_close).toHaveBeenCalled()
    })
  })
})
