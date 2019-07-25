import Media from '../../../../src/components/ui/Media'
import toJSON from 'enzyme-to-json'
import { compose } from 'redux'
import defaultPopupSettings from '../../../../src/data/popupSettings.json'
import { identityFn } from '../../../../src/lib/helpers'

const { shallow, mount } = Enzyme

describe('<Media /> Component', () => {
  let { popupSettings } = defaultPopupSettings
  let wrapper

  describe('Rendering UI', () => {
    it('Renders correctly', () => {
      compose(expect, toJSON, shallow)(<Media />).toMatchSnapshot()
    })

    describe('Rendering wrapper', () => {
      it('Callback to unlock Popup is called on fadeIn animation end', done => {
        const mockedWrapper = {
          style: {},
          applyFadeIn: true
        }
        const _actionPerformer = jest.fn(action => {
          expect(action).toBe('onMediaWrapperFadeComplete')
          done()
        })
        wrapper = mount(<Media wrapper={mockedWrapper} actionPerformer={_actionPerformer} popupSettings={popupSettings} />)
      })
    })

    describe('Rendering content', () => {
      let mockedContent = {
        style: {},
        status: 'idle',
        elToRender: {
          tagFamily: null,
          innerProps: {}
        }
      }

      beforeAll(() => {
        wrapper = mount(<Media />)
      })

      it('No HTML elements are rendered if specifications are not provided', () => {
        expect(wrapper.find('.pic').isEmptyRender()).toBe(true)
      })

      it('HTML elements built on specifications are correctly rendered', () => {
        mockedContent.elToRender.tagFamily = 'div'
        wrapper.setProps({ content: mockedContent })
        expect(wrapper.find('.pic').isEmptyRender()).not.toBe(true)
      })

      describe('Providing a callback on media content loaded', () => {
        let _actionPerformer

        beforeAll(() => {
          mockedContent.elToRender.innerProps.key = '5c608e9d-c265-465b-8925-9c4f6d80a782'
          mockedContent.elToRender.innerProps.src = 'http://via.placeholder.com/350x150'
          mockedContent.elToRender.tagFamily = 'img'
        })

        it('Do not invokes callback if content status is idle', () => {
          mockedContent.status = 'idle'
          wrapper.setProps({ content: mockedContent })
          expect(wrapper.find('MediaUI .pic').childAt(0).props().onLoad).toEqual(identityFn)
        })

        it('Invokes callback if content status is loading', done => {
          _actionPerformer = jest.fn((action, mediaStatus, forwardingArgs) => {
            expect(action).toBe('onMediaContentStatusChange')
            expect(mediaStatus).toBe('loaded')
            expect(forwardingArgs.dimensions).toHaveProperty('width')
            expect(forwardingArgs.dimensions).toHaveProperty('height')
            expect(forwardingArgs.prevStatus === 'loading' || forwardingArgs.prevStatus === 'resize').toBeTruthy()
            done()
          })
          mockedContent.status = 'loading'
          wrapper.setProps({ content: mockedContent, actionPerformer: _actionPerformer })
          wrapper.find('MediaUI .pic').childAt(0).simulate('load')

          mockedContent.status = 'resize'
          wrapper.setProps({ content: mockedContent, actionPerformer: _actionPerformer })
          wrapper.find('MediaUI .pic').childAt(0).simulate('load')
        })
      })
    })
  })
})
