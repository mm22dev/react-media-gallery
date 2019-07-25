import React from 'react'
import PropTypes from 'prop-types'
import { connectWithPopupSettings } from '../../providers/PopupSettings'
import { Fade } from '../_common'
import initData from '../../data/popupDefaultData.json'
import { identityFn, gcs, depixelify } from '../../lib/helpers'
import C from '../../actions/constants'

const MediaUI = ({ wrapper, content, structureSettings, actionPerformer, popupSettings }) => {
  const fadeProps = {
    inProp: false,
    immediate: true,
    ...(wrapper.applyFadeIn && {
      inProp: true,
      duration: popupSettings.fadeSpeed,
      immediate: false,
      onFadeComplete: () => actionPerformer(C.ON_MEDIAWRAPPER_FADE_COMPLETE.req, structureSettings)
    })
  }

  const onLoad = ev => {
    actionPerformer(
      C.ON_MEDIA_CONTENT_STATUS_CHANGE.req,
      'loaded',
      {
        dimensions: {
          width: depixelify(gcs(ev.currentTarget).getPropertyValue('width')),
          height: depixelify(gcs(ev.currentTarget).getPropertyValue('height'))
        },
        prevStatus: content.status
      }
    )
  }

  const mediaProps = {
    ...content.elToRender.innerProps,
    style: {
      ...(content.elToRender.innerProps && { ...content.elToRender.innerProps.style }),
      ...content.style
    },
    onLoad: content.status === 'loading' ? ev => onLoad(ev) : identityFn
  }

  return (
    <Fade { ...fadeProps }>
      <div className="pic" style={wrapper.style}>{
        content.elToRender.tagFamily
          ? React.createElement(content.elToRender.tagFamily, mediaProps)
          : null
      }</div>
    </Fade>
  )
}

MediaUI.propTypes = {
  wrapper: PropTypes.object,
  content: PropTypes.object,
  actionPerformer: PropTypes.func,
  popupSettings: PropTypes.object
}

MediaUI.defaultProps = {
  wrapper: initData.renderSettings.popup.childs.media.wrapper,
  content: initData.renderSettings.popup.childs.media.content,
  actionPerformer: identityFn
}

const Media = connectWithPopupSettings(MediaUI)
Media.displayName = 'Media'
export default Media
