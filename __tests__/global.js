import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

global.React = React
global.Component = React.Component
global.Enzyme = Enzyme
global.window = global
console.error = jest.fn()
