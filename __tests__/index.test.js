jest.mock('react-dom')

describe('App Entry Point - /src/index.js', () => {
  it('Renders app without error', () => {
    require('../src/index.js')
  })
})
