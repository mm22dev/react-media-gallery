const numbConv = cssProp => Number.isNaN(parseFloat(cssProp)) ? 0 : parseFloat(cssProp)

const isNodeEl = el => el !== null && typeof el === 'object' && 'nodeType' in el

export const S = (selector, ancestorEl = null) =>
  isNodeEl(ancestorEl)
    ? ancestorEl.querySelectorAll(selector).length > 0
      ? ancestorEl.querySelectorAll(selector)
      : null
    : document.querySelectorAll(selector).length > 0
      ? document.querySelectorAll(selector)
      : null

export const gcs = el => window.getComputedStyle(el)

export const cloneObj = obj => JSON.parse(JSON.stringify(obj))

export const getHeight = el => {
  if (el !== null && isNodeEl(el)) {
    const height = el.offsetHeight
    const borderTopWidth = gcs(el).getPropertyValue('border-top-width')
    const borderBottomWidth = gcs(el).getPropertyValue('border-bottom-width')
    const paddingTop = gcs(el).getPropertyValue('padding-top')
    const paddingBottom = gcs(el).getPropertyValue('padding-bottom')
    return height - numbConv(borderBottomWidth) - numbConv(borderTopWidth) - numbConv(paddingTop) - numbConv(paddingBottom)
  } else {
    return 0
  }
}

export const getWidth = el => {
  if (el !== null && isNodeEl(el)) {
    const width = el.offsetWidth
    const borderLeftWidth = gcs(el).getPropertyValue('border-left-width')
    const borderRightWidth = gcs(el).getPropertyValue('border-left-width')
    const paddingLeft = gcs(el).getPropertyValue('padding-left')
    const paddingRight = gcs(el).getPropertyValue('padding-right')
    return width - numbConv(borderRightWidth) - numbConv(borderLeftWidth) - numbConv(paddingLeft) - numbConv(paddingRight)
  } else {
    return 0
  }
}

export const identityFn = f => f

export const emptyQueueObject = {
  src: null,
  captionText: null,
  width: null,
  height: null,
  type: null,
  object: null,
  options: null
}

export const emptyMediaContent = {
  tagFamily: null,
  innerProps: {}
}

export const emptySpringSettings = {
  from: {},
  to: {},
  config: {},
  immediate: false,
  onRest: null
}

export const emptyActionReducer = {
  newState: null,
  callback: null
}

export const pixelify = size => `${size}px`

export const depixelify = size => +size.replace(/[^\d.-]/g, '')

export const hide = elementsArray => elementsArray.map(el => { el.style = { ...el.style, display: 'none' } })

export const show = (elementsArray, displayVariant = null) => elementsArray.map(el => { el.style = { ...el.style, display: (displayVariant !== null) ? displayVariant : 'block' } })

export const fadeOut = (elementsArray, duration = 400) => elementsArray.map(el => { el.fade = duration === 0 ? { inProp: false, immediate: true } : { inProp: false, duration: duration, immediate: false } })

export const fadeIn = (elementsArray, duration = 400) => elementsArray.map(el => { el.fade = duration === 0 ? { inProp: true, immediate: true } : { inProp: true, duration: duration, immediate: false } })

export class PRTError extends Error {
  constructor (message) {
    super(message)
    this.name = 'PopReactrox Warning'
  }
}
