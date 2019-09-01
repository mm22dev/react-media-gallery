import React from 'react'
import PropTypes from 'prop-types'
import { PopupSettingsProvider } from '../providers/PopupSettings'
import Overlay from './ui/Overlay'

const PopReactrox = ({ PRTSettings }) => (
  <PopupSettingsProvider PRTSettings={PRTSettings}>
    <Overlay />
  </PopupSettingsProvider>
)

PopReactrox.propTypes = {
  PRTSettings: PropTypes.object
}

PopReactrox.defaultProps = {
  PRTSettings: {}
}

export default PopReactrox
