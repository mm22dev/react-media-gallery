import { S, getHeight, getWidth, identityFn, emptyMediaContent, emptySpringSettings, emptyActionReducer, pixelify, depixelify, hide, show, fadeIn, fadeOut } from '../../src/lib/helpers'

describe('Helpers', () => {
  describe('Calling S', () => {
    beforeAll(() => {
      document.body.innerHTML =
        "<div class='mock-wrapper'>" +
        "  <div class='mock-content' />" +
        "  <div class='mock-content' />" +
        '</div>'
    })

    it('Returns null on inexistent selector', () => {
      expect(S('.mock-selector')).toBe(null)
    })

    it('Returns a non empty Node list on existent selector', () => {
      expect(S('.mock-wrapper')).not.toBe(null)
      expect(S('.mock-wrapper').length).toBeGreaterThan(0)
    })

    it('Returns null on inexistent descending', () => {
      expect(S('.mock-selector', S('.mock-wrapper')[0])).toBe(null)
    })

    it('Returns a non empty Node list on existent descending', () => {
      expect(S('.mock-content', S('.mock-wrapper'))).not.toBe(null)
      expect(S('.mock-content', S('.mock-wrapper')).length).toBeGreaterThan(0)
    })
  })

  describe('Calling getHeight and getWidth methods', () => {
    let elem

    beforeAll(() => {
      elem = document.createElement('div')
      elem.style.borderTopWidth = '100px'
      elem.style.paddingBottom = '100px'
      elem.style.paddingLeft = '50px'
      elem.style.paddingRight = '50px'
    })

    it("Element's height is obtained when Node element is provided", () => {
      expect(getHeight(elem)).toBe(elem.offsetHeight - 200)
    })

    it('0 value height is obtained when Node element is provided', () => {
      expect(getHeight({})).toBe(0)
    })

    it("Element's width is obtained when Node element is provided", () => {
      expect(getWidth(elem)).toBe(elem.offsetWidth - 100)
    })

    it('0 value width is obtained when Node element is provided', () => {
      expect(getWidth({})).toBe(0)
    })
  })

  describe('Calling identityFn', () => {
    it('Simply returns the argument passed in', () => {
      const params = [1, [], {}, null, undefined, false, 'string']
      params.map(el => expect(identityFn(el)).toBe(el))
    })
  })

  describe('Calling emptyMediaContent and emptySpringSettings and emptyActionReducer', () => {
    let _expectedFadeProps = {
      tagFamily: null,
      innerProps: {}
    }
    let _expectedSpringSettingsProps = {
      from: {},
      to: {},
      config: {},
      immediate: false,
      onRest: null
    }
    let _expectedActionReducer = {
      newState: null,
      callback: null
    }

    it(`A default fadeProps obj is returned`, () => {
      expect(emptyMediaContent).toEqual(_expectedFadeProps)
    })

    it(`A default springsEttingsProps obj is returned`, () => {
      expect(emptySpringSettings).toEqual(_expectedSpringSettingsProps)
    })

    it('A default actionReducer obj is returned', () => {
      expect(emptyActionReducer).toEqual(_expectedActionReducer)
    })
  })

  describe('Calling pixelify and depixelify', () => {
    it("The ending 'px' is added to the given parameter", () => {
      expect(pixelify(100)).toBe('100px')
    })

    it("The ending 'px' is removed from the given parameter", () => {
      expect(depixelify('100px')).toBe(100)
    })

    it('A string value is returned', () => {
      expect(typeof pixelify(100)).toBe('string')
      expect(typeof depixelify('100px')).toBe('number')
    })
  })

  describe('Calling hide and show', () => {
    let obj1, obj2

    beforeAll(() => {
      obj1 = {
        style: { display: 'block' }
      }
      obj2 = {}
    })

    it('Display property of the given objects is set correctly to hide them', () => {
      hide([obj1])
      hide([obj2])

      expect(obj1.style.display).toBe('none')
      expect(obj2.style.display).toBe('none')
    })

    it('Display property of the given objects is set correctly (customized or deafult) to show them', () => {
      obj2 = {}
      show([obj1])
      show([obj2], 'flex')
      expect(obj1.style.display).toBe('block')
      expect(obj2.style.display).toBe('flex')
    })
  })

  describe('Calling fadeIn and fadeOut', () => {
    let _elToBeFaded

    beforeEach(() => {
      _elToBeFaded = { foo: 'foo' }
    })

    it('fadeProps objects with default duration are returned', () => {
      const expectedEl = {
        ..._elToBeFaded,
        fade: {
          inProp: true,
          duration: 400,
          immediate: false
        }
      }

      fadeIn([_elToBeFaded])
      expect(_elToBeFaded).toEqual(expectedEl)
      fadeOut([_elToBeFaded])
      expect(_elToBeFaded).toEqual({ ...expectedEl, fade: { ...expectedEl.fade, inProp: false } })
    })

    it('fadeProps objects with custom duration are returned', () => {
      const expectedEl = {
        ..._elToBeFaded,
        fade: {
          inProp: true,
          duration: 1000,
          immediate: false
        }
      }
      fadeIn([_elToBeFaded], 1000)
      expect(_elToBeFaded).toEqual(expectedEl)
      fadeOut([_elToBeFaded], 1000)
      expect(_elToBeFaded).toEqual({ ...expectedEl, fade: { ...expectedEl.fade, inProp: false } })
    })

    it('fadeProps objects to avoid animation are returned', () => {
      const expectedEl = {
        ..._elToBeFaded,
        fade: {
          inProp: true,
          immediate: true
        }
      }
      fadeIn([_elToBeFaded], 0)
      expect(_elToBeFaded).toEqual(expectedEl)
      fadeOut([_elToBeFaded], 0)
      expect(_elToBeFaded).toEqual({ ...expectedEl, fade: { ...expectedEl.fade, inProp: false } })
    })
  })
})
