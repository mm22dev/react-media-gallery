import { Fade } from '../../../../../src/components/_common'
import { compose } from 'redux'
import toJSON from 'enzyme-to-json'

const { shallow, mount } = Enzyme

describe('<Fade /> Component', () => {
  let wrapper
  let _click = jest.fn()
  let MockComponent = class MockComponent extends Component {
    constructor (props) {
      super(props)
      this.handleClick = this.handleClick.bind(this)
    }
    handleClick () {
      _click(this.props.style)
      return this.props.style
    }
    render () {
      return <div onClick={this.handleClick} className='mock-component'></div>
    }
  }

  it('Renders correctly', () => {
    compose(expect, toJSON, shallow)(<Fade inProp={true} immediate={true} customDisplayOnFadeOutEnd={'flex'} />).toMatchSnapshot()
  })

  describe('Assigning style to the inner Component', () => {
    let mountWrapper,
      fadeProps

    beforeAll(() => {
      fadeProps = {
        inProp: true,
        duration: 100,
        immediate: false
      }
      mountWrapper = () => {
        wrapper = mount(
          <Fade {...fadeProps }>
            <MockComponent />
          </Fade>
        )
      }
    })

    afterAll(() => jest.resetAllMocks())

    it('Works on animation start', () => {
      mountWrapper()
      wrapper.find(MockComponent).simulate('click')
      expect(_click).toHaveBeenCalledWith({ display: '', opacity: 0 })
    })

    it('Works on animation end', done => {
      fadeProps.onFadeComplete = () => {
        wrapper.find(MockComponent).simulate('click')
        expect(_click).toHaveBeenCalledWith({ display: '', opacity: 1 })
        done()
      }
      mountWrapper()
    })
  })

  describe('createSpringSettings - Core method of Component', () => {
    let mockedCompProps,
      _createSpringSettings

    beforeEach(() => {
      mockedCompProps = {
        inProp: false,
        duration: 200,
        immediate: false,
        customDisplayOnFadeOutEnd: null
      }
      _createSpringSettings = mount(<Fade />).instance().createSpringSettings
    })

    it('Assigns custom display rule on fadeOut', () => {
      mockedCompProps.customDisplayOnFadeOutEnd = 'flex'
      expect(_createSpringSettings(mockedCompProps))
        .toEqual({
          from: { opacity: 1 },
          to: {
            display: 'flex',
            opacity: 0
          },
          config: { duration: 200 },
          immediate: true
        })
    })

    it('Not re-executes animation if it has already been done', () => {
      expect(_createSpringSettings({ ...mockedCompProps }))
        .toEqual({
          from: { opacity: 1 },
          to: {
            display: 'block',
            opacity: 0
          },
          config: { duration: 200 },
          immediate: true
        })
    })

    it('Calls callback only on animation end', () => {
      let result

      result = _createSpringSettings({ ...mockedCompProps })
      expect(result.onRest).not.toBeDefined()

      mockedCompProps.inProp = true
      result = _createSpringSettings({ ...mockedCompProps })
      expect(result.onRest).toBeDefined()
    })
  })
})
