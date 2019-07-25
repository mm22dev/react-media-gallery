import Caption from '../../../../src/components/ui/Caption'
import toJSON from 'enzyme-to-json'
import { compose } from 'redux'
import defaultPopupSettings from '../../../../src/data/popupSettings.json'

const { shallow, mount } = Enzyme

describe('<Caption /> Component', () => {
  let { popupSettings } = defaultPopupSettings
  popupSettings.usePopupCaption = true

  describe('Rendering UI', () => {
    it('Renders correctly', () => {
      compose(expect, toJSON, shallow)(<Caption />).toMatchSnapshot()
    })

    it('Does not Apply default style if required', () => {
      const fadeInjectedStyle = { display: 'block', opacity: 0 }
      expect(
        mount(<Caption popupSettings={{ ...popupSettings, usePopupDefaultStyling: false }} />)
          .find(popupSettings.popupCaptionSelector)
          .get(0)
          .props
          .style
      ).toEqual(fadeInjectedStyle)
    })
  })

  describe('Applying default properties', () => {
    it('Assigns correct default content', () => {
      expect(mount(<Caption popupSettings={popupSettings} />).childAt(0).text()).toBe('(untitled)')
    })

    it('Assigns correct default content', () => {
      expect(mount(<Caption popupSettings={popupSettings} children={''} />).childAt(0).text()).toBe('(untitled)')
    })
  })

  describe('Receiving props from parent.', () => {
    it('Assigns correct custom text size', () => {
      expect(
        mount(<Caption popupSettings={{ ...popupSettings, popupCaptionTextSize: '1em' }} />)
          .find(popupSettings.popupCaptionSelector)
          .get(0)
          .props
          .style
          .fontSize
      ).toBe('1em')
    })

    it('Fills the content with proper text', () => {
      expect(mount(<Caption popupSettings={popupSettings} children={'mock text'} />).childAt(0).text()).toBe('mock text')
    })
  })
})
