import PopReactrox from '../../../src/components/PopReactrox'
import { compose } from 'redux'
import toJSON from 'enzyme-to-json'

const { shallow } = Enzyme

describe('<PopReactrox /> Component ', () => {
  describe('Rendering the UI', () => {
    it('Renders correctly', () => {
      compose(expect, toJSON, shallow)(<PopReactrox />).toMatchSnapshot()
    })
  })
})
