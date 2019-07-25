import { PopupSettingsProvider, connectWithPopupSettings } from '../../../src/providers/PopupSettings'
import defaultPopupSettings from '../../../src/data/popupSettings.json'
import { compose } from 'redux'
import toJSON from 'enzyme-to-json'

const { shallow, mount } = Enzyme
const { popupSettings } = defaultPopupSettings

describe('PopupSettings Provider', () => {
  let wrapper,
    _validatePopupSettings

  const spy = jest.spyOn(PopupSettingsProvider.prototype, 'setState')

  it('Rendering Provider component', () => {
    compose(expect, toJSON, shallow)(<PopupSettingsProvider />).toMatchSnapshot()
  })

  describe('Mounting PopupSettings.', () => {
    it('Processes and updates provider values to be served to the consumer.', () => {
      const mockingPopupSettings = {
        usePopupLoader: false,
        usePopupCloser: false,
        usePopupCaption: true,
        usePopupNav: true
      }
      const expectedPopupSettings = {
        ...popupSettings,
        ...mockingPopupSettings,
        popupLoaderSelector: null,
        popupCloserSelector: null
      }
      _validatePopupSettings = jest.fn()
      wrapper = mount(<PopupSettingsProvider PRTSettings={mockingPopupSettings} />)
      wrapper.instance().validatePopupSettings = _validatePopupSettings
      wrapper.instance().componentDidMount()

      expect(wrapper.instance().state.popupSettings).toEqual(expectedPopupSettings)
      expect(_validatePopupSettings).toHaveBeenCalled()
    })
  })

  describe('Validating received props.', () => {
    it('Throws Error when supplied props mismatches type.', () => {
      const mockPRTSettings = {
        baseZIndex: 'mock-error',
        popupIsFixed: 'mock-error',
        overlayColor: 123,
        onPopupClose: 'mock-error',
        caption: 'mock-error'
      }
      wrapper = mount(<PopupSettingsProvider PRTSettings={mockPRTSettings} />)
      wrapper.instance().validatePopupSettings()
      expect(spy.mock.calls[1][0].errors[0]).toBe(`Invalid prop \`baseZIndex\` of type \`string\` supplied to PopReactrox, expected \`number\`.`)
      expect(spy.mock.calls[1][0].errors[1]).toBe(`Invalid prop \`popupIsFixed\` of type \`string\` supplied to PopReactrox, expected \`boolean\`.`)
      expect(spy.mock.calls[1][0].errors[2]).toBe(`Invalid prop \`overlayColor\` of type \`number\` supplied to PopReactrox, expected \`string\`.`)
      expect(spy.mock.calls[1][0].errors[3]).toBe(`Invalid prop \`onPopupClose\` of type \`string\` supplied to PopReactrox, expected \`function\`.`)
      expect(spy.mock.calls[1][0].errors[4]).toBe(`Invalid prop \`caption\` of type \`string\` supplied to PopReactrox, expected \`null\` or \`object\` or \`function\`.`)
    })
  })

  describe('Handling Errors', () => {
    it('Manages errors when component is mounted.', () => {
      const _handleErrors = jest.fn()
      wrapper = mount(<PopupSettingsProvider PRTSettings={{ baseZIndex: 'mock-error' }} />)
      wrapper.instance().handleErrors = _handleErrors
      wrapper.instance().componentDidMount()
      expect(_handleErrors).toHaveBeenCalled()
    })

    it('Deletes errors from state after beeing thrown.', () => {
      let _cdu = jest.fn()
      wrapper = mount(<PopupSettingsProvider />)
      wrapper.instance().componentDidUpdate = _cdu // prevent error deletion
      wrapper.instance().setState({ errors: ['mock-error'] })
      wrapper.instance().handleErrors()
      expect(wrapper.instance().state.errors.length).toBe(0)
    })
  })
})

describe('PopupSettings Consumer', () => {
  let wrapper
  let ComposedComponent
  let MockComponent = () => <div></div>
  ComposedComponent = connectWithPopupSettings(MockComponent)
  wrapper = mount(<PopupSettingsProvider>
    <ComposedComponent />
  </PopupSettingsProvider>)

  it('Serving props to Consumer', () => {
    const expectedPopupSettings = {
      ...popupSettings,
      popupCaptionSelector: null,
      popupNavPreviousSelector: null,
      popupNavNextSelector: null
    }
    expect(wrapper.find(MockComponent).get(0).props.popupSettings).toEqual(expectedPopupSettings) // on Provider's componentDidMount usePopupCaption and usePopupNav (both set to false) force popupCaptionSelector and popupNavSelector to the null value
  })
})
