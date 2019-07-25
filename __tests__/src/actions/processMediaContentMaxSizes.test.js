import processMediaContentMaxSizes from '../../../src/actions/processMediaContentMaxSizes'
import PopReactrox from '../../../src/components/PopReactrox'
import { depixelify } from '../../../src/lib/helpers'

const { mount } = Enzyme

describe('processMediaContentMaxSizes', () => {
  let _result

  const wrapper = mount(<PopReactrox />)
  const _popupComp = wrapper.find('PopupUI').instance()

  it('Returns the maximum size that the window can offer to the content.', () => {
    _result = processMediaContentMaxSizes(_popupComp)
    expect(_result).toHaveProperty('maxWidth')
    expect(_result).toHaveProperty('maxHeight')
    expect(typeof depixelify(_result.maxWidth)).toBe('number')
    expect(typeof depixelify(_result.maxHeight)).toBe('number')
  })
})
