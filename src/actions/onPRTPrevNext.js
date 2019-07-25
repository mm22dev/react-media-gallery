import C from './constants'
import { emptyActionReducer } from '../lib/helpers'

const onPRTPrevNext = (PopupComp, direction) => {
  const { navPos, queue } = PopupComp.state.structureSettings
  const numericDirection = { prev: -1, next: 1 }
  const indexProcessFns = {
    prev: x => (x < 0) ? queue.length - 1 : x,
    next: x => x >= queue.length ? 0 : x
  }
  let x = null
  let tmpNavPos = navPos

  while (x === null) {
    const processIndex = indexProcessFns[direction]
    const processedIndex = processIndex(tmpNavPos + 1 * (numericDirection[direction]))
    const isMediaToBeIgnored = PopupComp.state.structureSettings.queue[processedIndex] === null
    tmpNavPos = isMediaToBeIgnored ? tmpNavPos + 1 * numericDirection[direction] : tmpNavPos
    x = isMediaToBeIgnored ? null : processedIndex
  }

  return {
    ...emptyActionReducer,
    callback: () => PopupComp.performAction(C.ON_PRT_SWITCH.req, x, false)
  }
}

export default onPRTPrevNext
