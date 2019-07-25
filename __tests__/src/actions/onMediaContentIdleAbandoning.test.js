import onMediaContentIdleAbandoning from '../../../src/actions/onMediaContentIdleAbandoning'
import PopReactrox from '../../../src/components/PopReactrox'
import DOMPurify from 'dompurify'
import 'whatwg-fetch'

const { mount } = Enzyme

describe('onMediaContentIdleAbandoning', () => {
  let wrapper,
    _popupComp,
    _prevState,
    _queue,
    _performAction,
    _result

  const _mediaMocks = [
    {
      src: './popreactrox/__tests__/src/actions/mock.html',
      captionContent: null,
      width: '600',
      height: '400',
      type: 'ajax',
      object: {
        tagFamily: 'div',
        innerProps: {
          style: {}
        }
      },
      options: null
    },
    {
      src: 'https://youtu.be/vMTEtDBHGY4',
      captionContent: null,
      width: '50%',
      height: '50%',
      type: 'youtube',
      object: {
        tagFamily: 'iframe',
        innerProps: {
          style: {}
        }
      },
      options: null
    },
    {
      src: './popreactrox/__tests__/src/actions/mock.png',
      captionContent: null,
      width: null,
      height: null,
      type: 'image',
      object: {
        tagFamily: 'img',
        innerProps: {
          src: '',
          style: {}
        }
      },
      options: null
    }
  ]

  const getMockAjaxContent = async () => {
    let response = await window.fetch(`${_mediaMocks[0].src}`)
    let data = await response.text()
    return DOMPurify.sanitize(data)
  }

  beforeAll(() => {
    _queue = _mediaMocks
    wrapper = mount(<PopReactrox />)
    _popupComp = wrapper.find('PopupUI').instance()
    _prevState = _popupComp.state
    _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, queue: _queue } })
  })

  it('Prepares to load <Media /> content from ajax call.', done => {
    getMockAjaxContent()
      .then(data => {
        _performAction = jest.fn(() => {
          expect(_performAction.mock.calls[0][0]).toBe('onAjaxMediaLoading')
          expect(_performAction.mock.calls[0][1].renderSettings.popup.childs.media.content.elToRender.innerProps.dangerouslySetInnerHTML.__html).toBe(data)
          expect(_performAction.mock.calls[0][2]).toHaveProperty('width')
          expect(_performAction.mock.calls[0][2]).toHaveProperty('height')
          done()
        })
        _popupComp.performAction = _performAction
        _result = onMediaContentIdleAbandoning(_popupComp, 0)
        _result.callback()
      })
  })

  it('Prepares to load a video as <Media /> content.', () => {
    _performAction = jest.fn()
    _popupComp.performAction = _performAction
    _result = onMediaContentIdleAbandoning(_popupComp, 1)
    expect(_result.newState.renderSettings).not.toEqual(_popupComp.state.renderSettings)
    expect(_result.newState.structureSettings.navPos).toBe(1)
    _result.callback()
    expect(_performAction.mock.calls[0][0]).toBe('onMediaContentStatusChange')
    expect(_performAction.mock.calls[0][1]).toBe('loading')
    expect(_performAction.mock.calls[0][2]).toEqual({
      mediaContent: {
        ..._mediaMocks[1].object,
        innerProps: {
          ..._mediaMocks[1].object.innerProps,
          src: _mediaMocks[1].src
        }
      }
    })
  })

  it('Prepares to load an image as <Media /> content.', () => {
    _result = onMediaContentIdleAbandoning(_popupComp, 2)
    expect(_result.newState.renderSettings).not.toEqual(_popupComp.state.renderSettings)
    expect(_result.newState.structureSettings.navPos).toBe(2)
    _result.callback()
    expect(_performAction.mock.calls[0][0]).toBe('onMediaContentStatusChange')
    expect(_performAction.mock.calls[0][1]).toBe('loading')
    expect(_performAction.mock.calls[0][2]).toEqual({
      mediaContent: {
        ..._mediaMocks[2].object,
        innerProps: {
          ..._mediaMocks[2].object.innerProps,
          src: _mediaMocks[2].src
        }
      }
    })
  })

  it('Prepares to load an image as <Media /> content when <Popup /> has fixed sizes.', () => {
    wrapper = mount(<PopReactrox PRTSettings={{ popupIsFixed: true, popupWidth: 250, popupHeight: 150 }} />)
    _popupComp = wrapper.find('PopupUI').instance()
    _prevState = _popupComp.state
    _popupComp.setState({ structureSettings: { ..._prevState.structureSettings, queue: _queue } })
    _result = onMediaContentIdleAbandoning(_popupComp, 2)
    expect(_result.newState.renderSettings.popup.childs.media.content.style).toEqual({
      ..._prevState.renderSettings.popup.childs.media.content.style,
      position: '',
      outline: '',
      zIndex: '',
      width: '',
      height: '',
      maxWidth: '250px',
      maxHeight: '150px'
    })
  })
})
