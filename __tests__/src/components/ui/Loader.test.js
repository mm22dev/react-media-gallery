import Loader from '../../../../src/components/ui/Loader'
import toJSON from 'enzyme-to-json'
import { compose } from 'redux'
import defaultPopupSettings from '../../../../src/data/popupSettings.json'

const { shallow, mount } = Enzyme

describe('<Loader /> Component', () => {
  let { popupSettings } = defaultPopupSettings
  let wrapper

  describe('Rendering UI', () => {
    it('Renders correctly', () => {
      compose(expect, toJSON, shallow)(<Loader />).toMatchSnapshot()
    })

    it('Renders empty Component if required', () => {
      expect(mount(<Loader popupSettings={{ ...popupSettings, usePopupLoader: false, popupLoaderSelector: false }} />).isEmptyRender()).toBe(true)
    })

    it('Does not Apply default style if required', () => {
      const fadeInjectedStyle = { display: 'none', opacity: 0 }
      const parentInjectedStyle = {}
      const defaultWrapperStyle = {}
      wrapper = mount(<Loader popupSettings={{ ...popupSettings, usePopupDefaultStyling: false }} />)
      expect(wrapper.find(popupSettings.popupLoaderSelector).get(0).props.style)
        .toEqual({
          ...fadeInjectedStyle,
          ...parentInjectedStyle,
          ...defaultWrapperStyle
        })
    })

    it('Triggers CSS animation on loading request when default Popup style is applied', () => {
      wrapper = mount(<Loader popupSettings={{ ...popupSettings, usePopupDefaultStyling: true }} animate={true}/>)
      expect(wrapper.find(`${popupSettings.popupLoaderSelector} div`).get(0).props.className).toEqual(expect.stringContaining('animated'))
    })

    it('Renders a custom Loader text', () => {
      const _loaderText = 'mockedText'
      wrapper = mount(<Loader popupSettings={{ ...popupSettings, popupTextColor: null, popupLoaderText: _loaderText }} />)
      expect(wrapper.find('div').first().text()).toBe(_loaderText)
    })

    describe('Using Popup default style', () => {
      beforeAll(() => {
        wrapper = mount(<Loader popupSettings={{ ...popupSettings, usePopupDefaultStyling: true }} animate={true}/>)
      })

      it('Applies further margin top to content on animate request ', () => {
        expect(wrapper.find(`${popupSettings.popupLoaderSelector} div`).get(0).props.style.marginTop).not.toBeDefined()
        wrapper.setProps({ innerMarginTop: 100 })
        expect(wrapper.find(`${popupSettings.popupLoaderSelector} div`).get(0).props.style.marginTop).toBe('100px')
      })
    })
  })
})
