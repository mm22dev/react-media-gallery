import onQueueGeneration from '../../../src/actions/onQueueGeneration'
import PopReactrox from '../../../src/components/PopReactrox'

const { mount } = Enzyme

describe('onQueueGeneration', () => {
  let wrapper
  let _popupComp
  let _performAction = jest.fn()
  let _result

  const fillBodyWith = content => {
    document.body.innerHTML = "<div class='link-wrapper'>" + content + '</div>'
  }

  beforeAll(() => {
    wrapper = mount(<PopReactrox PRTSettings={{ selector: '.link-wrapper a', usePopupCaption: true }}/>)
    _popupComp = wrapper.find('PopupUI').instance()
    _popupComp.performAction = _performAction
  })

  describe('Creates a not empty queue even when media are not compliant.', () => {
    beforeAll(() => {
      fillBodyWith(
        "<a href='path/to/media' data-popreactrox='ignore'>" +
        "<img src='path/to/image' />" +
        '<a />'
      )
    })

    it('Returns a stuffed vector of null.', () => {
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue.length).toBeGreaterThan(0)
      expect(_result.newState.structureSettings.queue[0]).toBe(null)
      expect(_result.newState.structureSettings.queue[1]).toBe(null)
    })
  })

  describe('Getting caption.', () => {
    it("Provides anchor's title attribute as content.", () => {
      fillBodyWith(
        "<a href='path/to/media'>" +
        "<img src='path/to/image' title='mock-title' />" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].captionText).toBe('mock-title')
    })

    it('Provides content from given selector.', () => {
      fillBodyWith(
        "<a href='path/to/media'>" +
        "<img src='path/to/image' />" +
        '<h2>mock caption</h2>' +
        '</a>'
      )

      wrapper = mount(<PopReactrox PRTSettings={{ selector: '.link-wrapper a', caption: { selector: 'h2' } }}/>)
      _popupComp = wrapper.find('PopupUI').instance()
      expect(wrapper.find('PopupUI').instance().state.structureSettings.queue[0].captionText).toBe('mock caption')
    })

    it("Provides content from attribute's element of given selector.", () => {
      fillBodyWith(
        "<a href='path/to/media'>" +
        "<img src='path/to/image' />" +
        "<h2 data-mock='mock content'>mock caption</h2>" +
        '</a>'
      )
      wrapper = mount(<PopReactrox PRTSettings={{ selector: '.link-wrapper a', caption: { selector: 'h2', attribute: 'data-mock' } }}/>)
      _popupComp = wrapper.find('PopupUI').instance()
      expect(wrapper.find('PopupUI').instance().state.structureSettings.queue[0].captionText).toBe('mock content')
    })

    it('Provides content from custom function.', () => {
      fillBodyWith(
        "<a href='path/to/media'>" +
        "<img src='path/to/image' />" +
        '</a>' +
        '<h2>mock caption</h2>'
      )
      const captionFn = anchor => anchor.nextElementSibling.textContent
      wrapper = mount(<PopReactrox PRTSettings={{ selector: '.link-wrapper a', caption: captionFn }}/>)
      _popupComp = wrapper.find('PopupUI').instance()
      expect(wrapper.find('PopupUI').instance().state.structureSettings.queue[0].captionText).toBe('mock caption')
    })

    it('Provides blank content in case of mismatched settings.', () => {
      wrapper = mount(<PopReactrox PRTSettings={{ selector: '.link-wrapper a', caption: { foo: 'foo' } }}/>)
      _popupComp = wrapper.find('PopupUI').instance()
      _popupComp.performAction = _performAction

      fillBodyWith(
        "<a href='path/to/media'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].captionText).toBe('')
    })
  })

  describe('Processing anchor data.', () => {
    beforeAll(() => {
      wrapper = mount(<PopReactrox PRTSettings={{ selector: '.link-wrapper a' }}/>)
      _popupComp = wrapper.find('PopupUI').instance()
      _popupComp.performAction = _performAction
    })

    it('Updates type.', () => {
      fillBodyWith(
        "<a href='path/to/media' data-popreactrox='image'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].type).toBe('image')
      expect(_result.newState.structureSettings.queue[0].width).toBe(null)
      expect(_result.newState.structureSettings.queue[0].height).toBe(null)
      expect(_result.newState.structureSettings.queue[0].options).toBe(null)
    })

    it('Updates sizes.', () => {
      fillBodyWith(
        "<a href='path/to/media' data-popreactrox='ajax,200x100'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].width).toBe('200')
      expect(_result.newState.structureSettings.queue[0].height).toBe('100')
    })

    it('Updates option.', () => {
      fillBodyWith(
        "<a href='path/to/media' data-popreactrox='image,200x100,option'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].options).toBe('option')
    })
  })

  describe('Getting type.', () => {
    beforeAll(() => {
      wrapper = mount(<PopReactrox PRTSettings={{ selector: '.link-wrapper a' }}/>)
      _popupComp = wrapper.find('PopupUI').instance()
      _popupComp.performAction = _performAction
    })

    it('Detects supported media urls.', () => {
      fillBodyWith(
        "<a href='https://youtu.be/yUpREizsftU'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].type).toBe('youtube')
    })

    it('Detects spotify urls.', () => {
      fillBodyWith(
        "<a href='https://open.spotify.com/xxxxx/xxxxxxxxxxxxxxx'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].type).toBe('spotify')
    })

    it('Detects unsupported media urls.', () => {
      fillBodyWith(
        "<a href='https://mockurl.com/mockid'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].type).toBe('image')
    })

    it('Updates the type by assigning the default value.', () => {
      fillBodyWith(
        "<a href='mock/path'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].type).toBe('image')
    })
  })

  describe('Getting object.', () => {
    beforeAll(() => {
      wrapper = mount(<PopReactrox PRTSettings={{ selector: '.link-wrapper a' }}/>)
      _popupComp = wrapper.find('PopupUI').instance()
      _popupComp.performAction = _performAction
    })

    it('Generates an iframe object.', () => {
      fillBodyWith(
        "<a href='path/to/media' data-popreactrox='iframe'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].object.tagFamily).toBe('iframe')
    })

    it("Calling iframe's object method does not cause error.", () => {
      expect(typeof _result.newState.structureSettings.queue[0].object.innerProps.onClick).toBe('function')
      _result.newState.structureSettings.queue[0].object.innerProps.onClick(new MouseEvent('click'))
    })

    it('Generates an ajax object.', () => {
      fillBodyWith(
        "<a href='path/to/media' data-popreactrox='ajax'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].object.tagFamily).toBe('div')
      expect(_result.newState.structureSettings.queue[0].object.innerProps.className).toBe('popreactrox-ajax')
    })

    it("Calling iframe's object method does not cause error.", () => {
      expect(typeof _result.newState.structureSettings.queue[0].object.innerProps.onClick).toBe('function')
      _result.newState.structureSettings.queue[0].object.innerProps.onClick(new MouseEvent('click'))
    })

    it('Generates a soundcloud object.', () => {
      fillBodyWith(
        "<a href='https://api.soundcloud.com/tracks/xxxxxxxx' data-popreactrox='soundcloud'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].object.tagFamily).toBe('iframe')
    })

    it('Generates a soundcloud object with additional options.', () => {
      fillBodyWith(
        "<a href='https://api.soundcloud.com/tracks/xxxxxxxx' data-popreactrox='soundcloud,100x100,option'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].options).toBe('option')
    })

    it('Generates a youtube object.', () => {
      fillBodyWith(
        "<a href='http://youtu.be/loGm3vT8EAQ' data-popreactrox='youtube'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].object.tagFamily).toBe('iframe')
    })

    it('Generates a youtube object with additional options.', () => {
      fillBodyWith(
        "<a href='http://youtu.be/loGm3vT8EAQ' data-popreactrox='youtube,100x100,option'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].options).toBe('option')
    })

    it('Generates a vimeo object.', () => {
      fillBodyWith(
        "<a href='http://vimeo.com/xxxxxxxx' data-popreactrox='vimeo'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].object.tagFamily).toBe('iframe')
    })

    it('Generates a vimeo object with additional options.', () => {
      fillBodyWith(
        "<a href='http://vimeo.com/xxxxxxxx' data-popreactrox='vimeo,100x100,option'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].options).toBe('option')
    })

    it('Generates a spotify object.', () => {
      fillBodyWith(
        "<a href='https://open.spotify.com/xxxxx/xxxxxxxxxxxxxxx' data-popreactrox='spotify'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].object.tagFamily).toBe('iframe')
    })

    it('Generates a dailymotion object.', () => {
      fillBodyWith(
        "<a href='https://dai.ly/xxxxxxxx' data-popreactrox='dailymotion'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].object.tagFamily).toBe('iframe')
    })

    it('Generates a dailymotion object with additional options.', () => {
      fillBodyWith(
        "<a href='https://dai.ly/xxxxxxxx' data-popreactrox='dailymotion,100x100,option'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].options).toBe('option')
    })

    it('Generates a default image object.', () => {
      fillBodyWith(
        "<a href='path/to/image'>" +
        "<img src='path/to/image'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].object.tagFamily).toBe('img')
    })

    it('Generates a default image object and adds it to cache.', () => {
      wrapper = mount(<PopReactrox PRTSettings={{ selector: '.link-wrapper a', preload: true }}/>)
      _popupComp = wrapper.find('PopupUI').instance()
      _popupComp.performAction = _performAction
      fillBodyWith(
        "<a href='path/to/image1'>" +
        "<img src='path/to/image1'/>" +
        '</a>' +
        "<a href='path/to/image2'>" +
        "<img src='path/to/image2'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.cache.length).toBe(2)
    })
  })

  describe('Verifying provided data.', () => {
    beforeAll(() => {
      wrapper = mount(<PopReactrox PRTSettings={{ selector: '.link-wrapper a' }}/>)
      _popupComp = wrapper.find('PopupUI').instance()
      _popupComp.performAction = _performAction
    })

    it('Prepare to throw Error if invalid type is assigned.', () => {
      fillBodyWith(
        "<a href='path/to/image1' data-popreactrox='invalidType'>" +
        "<img src='path/to/image1'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.errors.length).toBeGreaterThan(0)
    })

    it('Prepare to throw Error if provided option is not preceded by sizes.', () => {
      fillBodyWith(
        "<a href='path/to/image1' data-popreactrox='ajax,option'>" +
        "<img src='path/to/image1'/>" +
        '</a>'
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.queue[0].options).toBe(null)
    })

    it('Prepare to throw Error if img tag inside anchor is missing.', () => {
      fillBodyWith(
        "<a href='path/to/image1' ></a>"
      )
      _result = onQueueGeneration(_popupComp)
      expect(_result.newState.structureSettings.errors.length).toBeGreaterThan(0)
      expect(_result.newState.structureSettings.errors[0]).toBe(`Missing img element inside the anchor pointing to \`path/to/image1\`.`)
    })
  })

  describe('Refreshing media queue.', () => {
    it('Prepares <Overlay /> to update state.', () => {
      const _updateStateWith = jest.fn()
      wrapper.find('OverlayUI').instance().updateStateWith = _updateStateWith
      _result = onQueueGeneration(_popupComp, wrapper.find('OverlayUI').instance().updateStateWith, true)
      _result.callback()
      expect(_updateStateWith.mock.calls[0][0].status).toBe('refreshed')
    })
  })
})
