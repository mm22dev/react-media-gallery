import getAction from '../../../src/actions'
import onPopupClick from '../../../src/actions/onPopupClick'

describe('Getting action', () => {
  it('gets sample function', () => {
    const _sampleFnName = 'onPopupClick'
    const _sampleFn = getAction(_sampleFnName)
    expect(_sampleFn).toBe(onPopupClick)
  })

  it('Does not throw Error when nonnexistent action is provided.', () => {
    const _result = (getAction('mock-action'))()
    expect(_result).toEqual({
      newState: null,
      callback: null
    })
  })
})
