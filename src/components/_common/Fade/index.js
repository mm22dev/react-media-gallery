import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Spring } from 'react-spring/renderprops'
import { emptySpringSettings, identityFn, cloneObj } from '../../../lib/helpers'

class Fade extends Component {
  constructor (props) {
    super(props)
    this.createSpringSettings = this.createSpringSettings.bind(this)
    this.state = { show: false }
  }

  createSpringSettings (ComponentProps) {
    const fadeDirection = ComponentProps.inProp ? 'in' : 'out'
    const isAlreadyAnimated = this.state.show === ComponentProps.inProp
    const customDisplay = ComponentProps.customDisplayOnFadeOutEnd !== null ? ComponentProps.customDisplayOnFadeOutEnd : 'block'
    let springSettings = cloneObj(emptySpringSettings)
    delete springSettings.onRest
    const fromTo = {
      in: {
        from: {
          display: '',
          opacity: 0
        },
        to: {
          display: '',
          opacity: 1
        }
      },
      out: {
        from: { opacity: 1 },
        to: {
          display: isAlreadyAnimated ? customDisplay : '',
          opacity: 0
        }
      }
    }
    const { from, to } = fromTo[fadeDirection]
    springSettings.from = from
    springSettings.to = to
    springSettings.config = { duration: ComponentProps.duration ? ComponentProps.duration : 300 }
    springSettings.immediate = ComponentProps.immediate ? true : isAlreadyAnimated
    if (!isAlreadyAnimated) {
      springSettings.onRest = () => {
        this.setState({ show: ComponentProps.inProp }, () => ComponentProps.onFadeComplete())
      }
    }

    return springSettings
  }

  render () {
    const springSettings = this.createSpringSettings(this.props)

    return (
      this.props.children !== null
        ? <Spring {...springSettings}>
          {
            springProps => (
              React.cloneElement(this.props.children, {
                style: {
                  ...this.props.children.props.style,
                  ...springProps
                }
              })
            )
          }
        </Spring>
        : null
    )
  }
}

Fade.propTypes = {
  inProp: PropTypes.bool,
  duration: PropTypes.number,
  immediate: PropTypes.bool,
  children: PropTypes.node,
  customDisplayOnFadeOutEnd: PropTypes.string,
  onFadeComplete: PropTypes.func
}

Fade.defaultProps = {
  inProp: false,
  duration: 400,
  immediate: false,
  children: null,
  customDisplayOnFadeOutEnd: null,
  onFadeComplete: identityFn
}

export default Fade
