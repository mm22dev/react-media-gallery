import onPopupSizesAnimationEnd from '../../../src/actions/onPopupSizesAnimationEnd'
import PopReactrox from '../../../src/components/PopReactrox'

const { mount } = Enzyme

describe('onPopupSizesAnimationEnd', () => {
  let wrapper
  let _popupComp
  let _defaultSettings = {
    triggerAnimation: false,
    duration: 0,
    immediate: false,
    sizes: {
      width: '0px',
      height: '0px'
    }
  }
  let _newSizes = {
    width: '200px',
    height: '100px'
  }
  let _expectedResult
  let _result

  beforeAll(() => {
    wrapper = mount(<PopReactrox />)
    _popupComp = wrapper.find('PopupUI').instance()
  })

  it('Update settings to be passed to popups inner component <Spring />.', () => {
    _expectedResult = {
      springAnimationSettings: {
        triggerAnimation: false,
        duration: 0,
        immediate: false,
        sizes: {
          width: '200px',
          height: '100px'
        }
      }
    }
    _result = onPopupSizesAnimationEnd(_popupComp, _defaultSettings, _newSizes)
    expect(_result.newState).toEqual(_expectedResult)
  })
})
