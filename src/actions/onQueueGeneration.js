import { emptyQueueObject, cloneObj } from '../lib/helpers'
import v4 from 'uuid'
import resetPRTUI from './resetPRTUI'

const getCaption = (caption, i, a) => !caption
  ? i.getAttribute('title')
  : typeof caption === 'function'
    ? caption(a)
    : (!('selector' in caption))
      ? ''
      : 'attribute' in caption
        ? a.querySelectorAll(caption.selector)[0].getAttribute(caption.attribute)
        : a.querySelectorAll(caption.selector)[0].textContent

const processAnchorData = (data, queueObj) => {
  const x = {}
  let b = data.split(',')
  x.type = b[0].trim()
  const customSizes = (1 in b) ? b[1].trim().match(/([0-9%]+)x([0-9%]+)/) : [false]
  const areSizesAssigned = customSizes && customSizes.length === 3
  x.width = areSizesAssigned ? customSizes[1] : queueObj.width
  x.height = areSizesAssigned ? customSizes[2] : queueObj.height
  x.options = (2 in b) ? b[2].trim() : queueObj.options
  const err = (areSizesAssigned === null && b.length >= 2) ? [`Invalid data-popreactrox. To assign an option, type and sizes must first be provide. Check the option corresponding to the '${queueObj.src}' source.`] : []
  return { processedData: x, err }
}

const getType = queueObj => {
  let tmp = queueObj.src.match(/\/\/([a-z0-9.]+)\/.*/)
  tmp = (!tmp || tmp.length < 2) ? [false] : tmp
  const cases = { 'dai.ly': 'dailymotion', 'api.soundcloud.com': 'soundcloud', 'open.spotify.com': 'spotify', 'vimeo.com': 'vimeo', 'youtu.be': 'youtube' }
  return { type: cases.hasOwnProperty(tmp[1]) ? cases[tmp[1]] : 'image' }
}

const optimizeSizes = (type, queueObj) => {
  const defaultSizes = {
    ajax: { width: '600', height: '400' },
    dailymotion: { width: '800', height: '480' },
    iframe: { width: '600', height: '400' },
    soundcloud: { width: '600', height: '200' },
    spotify: { width: '350', height: '380' },
    vimeo: { width: '800', height: '480' },
    youtube: { width: '800', height: '480' }
  }
  return { ...((!queueObj.width || !queueObj.height) && defaultSizes[type]) }
}

const getObject = (queueObj, preload, a) => {
  let x = {}
  let tmp = queueObj.src.match(/\/\/[a-z0-9.]+\/(.*)/)
  let cache = []

  switch (queueObj.type) {
    case 'ajax':
      x.object = {
        tagFamily: 'div',
        innerProps: {
          key: v4(),
          className: 'popreactrox-ajax',
          style: {
            cursor: 'auto',
            overflow: 'auto'
          },
          onClick: ev => ev.stopPropagation()
        }
      }
      x = { ...x, ...optimizeSizes('ajax', queueObj) }
      break

    case 'dailymotion':
      x.object = {
        tagFamily: 'iframe',
        innerProps: {
          key: v4(),
          allowFullScreen: '1',
          allow: 'autoplay',
          frameBorder: 0,
          src: ''
        }
      }
      x.src = `//www.dailymotion.com/embed/video/${tmp[1]}${queueObj.options ? `?${queueObj.options}` : ``}`
      x = { ...x, ...optimizeSizes('dailymotion', queueObj) }
      break

    case 'iframe':
      x.object = {
        tagFamily: 'iframe',
        innerProps: {
          key: v4(),
          frameBorder: 0,
          style: {
            cursor: 'auto'
          },
          onClick: ev => ev.stopPropagation()
        }
      }
      x = { ...x, ...optimizeSizes('iframe', queueObj) }
      break

    case 'soundcloud':
      x.object = {
        tagFamily: 'iframe',
        innerProps: {
          key: v4(),
          scrolling: 'no',
          frameBorder: 0,
          src: ''
        }
      }
      x.src = `//w.soundcloud.com/player/?url=${tmp[0]}${queueObj.options ? `&${queueObj.options}` : ``}`
      x = { ...x, ...optimizeSizes('soundcloud', queueObj) }
      break

    case 'spotify':
      x.object = {
        tagFamily: 'iframe',
        innerProps: {
          key: v4(),
          scrolling: 'no',
          frameBorder: 0,
          src: ''
        }
      }
      x.src = `//open.spotify.com/embed/${tmp[1]}`
      x = { ...x, ...optimizeSizes('spotify', queueObj) }
      break

    case 'vimeo':
      x.object = {
        tagFamily: 'iframe',
        innerProps: {
          key: v4(),
          allowFullScreen: '1',
          allow: 'autoplay',
          frameBorder: 0,
          src: ''
        }
      }
      x.src = `//player.vimeo.com/video/${tmp[1]}${queueObj.options ? `?${queueObj.options}` : ``}`
      x = { ...x, ...optimizeSizes('vimeo', queueObj) }
      break

    case 'youtube':
      x.object = {
        tagFamily: 'iframe',
        innerProps: {
          key: v4(),
          allowFullScreen: '1',
          allow: 'autoplay',
          frameBorder: 0,
          src: ''
        }
      }
      x.src = `//www.youtube.com/embed/${tmp[1]}${queueObj.options ? `?${queueObj.options}` : ``}`
      x = { ...x, ...optimizeSizes('youtube', queueObj) }
      break

    default:
      x.object = {
        tagFamily: 'img',
        innerProps: {
          key: v4(),
          src: '',
          alt: '',
          style: { verticalAlign: 'middle' }
        }
      }
      if (preload) {
        let img = document.createElement('img')
        img.src = x.src
        cache = [...cache, img]
      }
      x.width = a.getAttribute('width')
      x.height = a.getAttribute('height')
      break
  }

  return {
    object: x,
    cachedImg: cache
  }
}

const detectAnyTypeError = (cases, x) => !cases.includes(x.type)
  ? [`Invalid data-popreactrox. Supplied type \`${x.type}\` not supported.`]
  : []

const onQueueGeneration = (PopupComp, updateOverlayStateWith, isARefresh) => {
  const { selector, caption, preload } = PopupComp.popupSettings
  const elWrap = document.querySelectorAll(selector)
  const anchors = [...elWrap]
  const supportedType = [ 'soundcloud', 'spotify', 'dailymotion', 'youtube', 'vimeo', 'image', 'iframe', 'ajax' ]
  let mediaKeys = []; let queue = []; let cache = []; let errors = []

  anchors.map(a => {
    const key = v4()
    a.setAttribute('data-prt-key', key)
    mediaKeys.push(key)
    let x = cloneObj(emptyQueueObject)
    let data = a.getAttribute('data-popreactrox')
    const i = a.querySelectorAll('img').length > 0 ? a.querySelectorAll('img')[0] : null
    if (i === null) errors.push(`Missing img element inside the anchor pointing to \`${a.getAttribute('href')}\`.`)

    if (i === null || data === 'ignore' || !a.getAttribute('href')) {
      queue.push(null)
    } else {
      // src
      x.src = a.getAttribute('href')
      // caption
      x.captionText = getCaption(caption, i, a)
      // type, width, height, option
      let { processedData, err } = { ...(data && processAnchorData(data, x)) }
      err = err || []
      x = { ...x, ...(processedData && processedData) }
      // type
      x = { ...x, ...(!x.type && getType(x)) }
      errors = [
        ...errors,
        ...detectAnyTypeError(supportedType, x),
        ...err
      ]
      // object, src, width, height
      const { object, cachedImg } = { ...getObject(x, preload, a) }
      x = { ...x, ...object }

      cache = [...cache, ...cachedImg]

      x = supportedType.includes(x.type) ? x : null

      queue.push(x)

      a.style.outline = 0
    }
  })

  return {
    newState: { renderSettings: resetPRTUI(PopupComp), structureSettings: { ...PopupComp.state.structureSettings, queue: queue, cache: cache, errors: errors } },
    callback: () => updateOverlayStateWith({ mediaKeys: mediaKeys, ...(isARefresh && { status: 'refreshed' }) })
  }
}

export default onQueueGeneration
