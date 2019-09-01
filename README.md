# A responsive customizable media gallery for React apps.

Let your multimedia content take center stage with react-media-gallery. The easy to use component supports images, videos (YouTube, Vimeo, Dailymotion), Soundcloud and Spotify tracks, IFRAME's and AJAX content.

*Based on [poptrox](https://github.com/ajlkn/jquery.poptrox)*

## Preview

<p align="center">
  <img width="840" height="450" src="https://react-media-gallery.s3.eu-west-3.amazonaws.com/header-opt.gif"></img>
</p>

## Installation

```bash
npm install react-media-gallery
```

## Minimal setup example

Let's create a minimal gallery. A multimedia content to be shown by PopReactrox must, at least, be an anchor nesting an image as shown below.

```html
<div id='minimal-gallery'>
	<a href="path/to/serve/src1">
		<img src="path/to/thumbnail1.jpg" />
	</a>
	<a href="path/to/serve/src2">
		<img src="path/to/thumbnail2.jpg" />
	</a>
</div>
```
The anchor points to the source we want to show in PopReactrox. The inner image points to the thumbnail we want our gallery to show.
All that remains is to provide a `selector` to PopReactrox in order to find media contents to show:


```js
import React from 'react'
import PopReactrox from 'react-media-gallery'

//...
render() {
    return (
      <PopReactrox PRTSettings={{selector: '#minimal-gallery a'}} />    
    );
}
//...
```

## Props

| **Key** | **Type** | **Default Value** | **Description** |
| --- | --- | --- | --- |
| preload | `boolean` | `false` | If true, preload fullsize images in the background |
| baseZIndex | `number` | `1000` | Base Z-Index |
| fadeSpeed | `number` | `300` | Global fade speed (ms) |
| overlayColor | `string` | `#000000` | Overlay color |
| overlayOpacity | `number` | `0.6` | Overlay opacity |
| overlayClass | `string` | `popreactrox-overlay` | Overlay class name |
| windowMargin | `number` | `50` | Window margin size (in pixels; only comes into play when a content is larger than the viewport) |
| windowHeightPad | `number` | `0` | Window height padding |
| selector | `string` | `null` | Anchor tag selector |
| caption | `object`, `function` | `null` | Caption settings (see below) |
| popupSpeed | `number` | `300` | Popup resize speed (ms) |
| popupWidth | `number` | `200` | Popup width |
| popupHeight | `number` | `100` | Popup height |
| popupIsFixed | `boolean` | `false` | If true, popup won't resize to fit content |
| useBodyOverflow | `boolean` | `false` | If true, the BODY tag is set to overflow: hidden when the popup is visible |
| usePopupEasyClose | `boolean` | `true` | If true, popup can be closed by clicking on it anywhere |
| usePopupForceClose | `boolean` | `false` | If true, popup can be closed even while content is loading |
| usePopupLoader | `boolean` | `true` | If true, show the popup loader |
| usePopupCloser | `boolean` | `true` | If true, show the popup closer button |
| usePopupCaption | `boolean` | `false` | If true, show caption inside popup |
| usePopupNav | `boolean` | `false` | If true, show (and use) popup navigation |
| usePopupDefaultStyling | `boolean` | `true` | If true, default popup styling will be applied (background color, text color, etc) |
| popupBackgroundColor | `string` | `#FFFFFF` | Popup background color (when usePopupStyling = true) |
| popupTextColor | `string` | `#000000` | Popup text color (when usePopupStyling = true) |
| popupLoaderTextSize | `string` | `2em` | Popup loader text size (when usePopupStyling = true) |
| popupCloserBackgroundColor | `string` | `#000000` | Popup closer background color (when usePopupStyling = true) |
| popupCloserTextColor | `string` | `#FFFFFF` | Popup closer text color (when usePopupStyling = true) |
| popupCloserTextSize | `string` | `20px` | Popup closer text size (when usePopupStyling = true) |
| popupPadding | `number` | `10` | Popup padding (when usePopupStyling = true) |
| popupCaptionHeight | `number` | `60` | Popup height of caption area (when usePopupStyling = true) |
| popupCaptionTextSize | `string` | `null` | Popup caption text size (when usePopupStyling = true) |
| popupBlankCaptionText | `string` | `(untitled)` | Applied to contents that don't have captions (when captions are enabled) |
| popupCloserText | `string` | `\u00d7` | Popup closer text |
| popupLoaderText | `string` | `\u2022\u2022\u2022\u2022` | Popup loader text |
| popupClass | `string` | `popreactrox-popup` | Popup class |
| popupSelector | `string` | `null` | (For style customization) Popup selector |
| popupLoaderSelector | `string` | `.loader` | (For style customization) Popup Loader selector |
| popupCloserSelector | `string` | `.closer` | (For style customization) Popup Closer selector |
| popupCaptionSelector | `string` | `.caption` | (For style customization) Popup Caption selector |
| popupNavPreviousSelector | `string` | `.nav-previous` | (For style customization) Popup Nav Previous selector |
| popupNavNextSelector | `string` | `.nav-next` | (For style customization) Popup Next Previous selector |
| onPopupClose | `function` | `null` | Called when popup closes |
| onPopupOpen | `function` | `null` | Called when popup opens |

## Key shortcuts

Use left and right arrow keys to switch contents when `usePopupNav` is enabled. Close the popup with Escape key.

## Captions

Don't forget to set `usePopupCaption` to **true** if you want to show captions inside PopReactrox.
You can choose between three assignment methods:
1. Setting `caption` to **null** causes PopReactrox to search for the caption's content in the **title** attribute of the **img** tag of your media element: 

```html
<a href="path/to/serve/src">
	<img src="path/to/thumbnail" title="What a nice media element!" />
</a>
```
```js
caption: null // Show "What a nice media element!"
```

2. Caption's content can be taken from the text content or from the data-attribute of a separate element, **as long as the element is inside the anchor**.
```html
<a href="path/to/serve/src1">
	<img src="path/to/thumbnail1" title="What a nice media element!" />
	<span style="display: none;" class="description">Awesome media</span>
</a>
<a href="path/to/serve/src2">
	<img src="path/to/thumbnail2" title="What a nice media element!" />
	<span style="display: none;" class="description" data-desc="Magnificent media"></span>
</a>
```
```js
caption: { selector: ".description" } // Show "Awesome media"

caption: { selector: ".description", attribute: "data-desc" } // Show "Magnificent media"
```
3. The advanced method consists in using a callback function (**whose only argument is the anchor element**) to retrieve nested contents. 
```html
<ul>
	<li data-desc="Superb media">
		<a href="path/to/serve/src1">
			<img src="path/to/thumbnail1" />
		</a>
	<li>
	<li>
		<a href="path/to/serve/src2">
			<img src="path/to/thumbnail2" />
		</a>
	<li>
</ul>
```
```js
caption: a => {
	const suppliedContent = a.parentNode.getAttribute('data-desc')
	return suppliedContent
		? suppliedContent
		: 'No description'
}
// Show respectively "Superb media" and "No description"
```

## Supported Types

PopReactrox supports different media types. 
To allow PopReactrox to recognize them, a `data-popreactrox` attribute must be provided to the anchors tag.
By default a media anchor pointed by `selector` is interpreted as an image and does not require any `data-popreactrox`.

```html
<a href="path/to/serve/src" data-popreactrox="type,sizes,options"><img src="path/to/thumbnail" /></a>
```

The content of `data-popreactrox` is a string consisting in a comma separated list of parameters:

- `type`: Media type (see below)
- `sizes`: Optional width and height separated by the 'x' character for custom popup sizes. Examples: 600x400 (pixel) or 80%x75% (percentage) or 100%x200 (hybrid). No other format is accepted.
- `options`: An optional list of options separated by the '&' character for those elements that support it. The parameter will not be interpreted if `sizes` is not provided.
 
### AJAX Content

- Link format: Anything (as long as it's on the same domain)
- Type: `ajax`
- Default sizes: 600x400
- Options: Not supported
```html
<a href="path/to/whatever.html" data-popreactrox="ajax"><img src="path/to/thumbnail" /></a>
```

### Dailymotion Videos

- Link format: `http://dai.ly/xxxxx` (found via the "Share" button under "Copy link")
- Type: `dailymotion`
- Default sizes: 800x480
- Options: [Dailymotion parameters](https://developer.dailymotion.com/player#player-parameters)
```html
<a href="https://dai.ly/x7cf11d" data-popreactrox="dailymotion,600x400,autoplay=true"><img src="path/to/thumbnail"/></a>
```

### IFRAMEs

- Link format: Anything.
- Type: `iframe`
- Default Sizes: 600x400
- Options: Not supported
```html
<a href="path/to/whatever.html" data-popreactrox="iframe"><img src="path/to/thumbnail" /></a>
```

### Soundcloud Tracks

- Link format: `https://soundcloud.com/xxxxx/xxxxx` (found via the "Share" button)
- Type: `soundcloud`
- Default Sizes: 600x200
- Options: [Soundcloud Parameters](https://developers.soundcloud.com/docs/api/html5-widget)
```html
<a href="https://soundcloud.com/reminiscience/chopin-nocturne-op-9-no-2" data-popreactrox="soundcloud,80%x30%,download=true"><img src="path/to/thumbnail" /></a>
```

### Spotify Tracks

- Link format: `https://open.spotify.com/xxxxx/xxxxx` (Right-click any song, album, artist, playlist or podcast. Get link under “Copy Song Link” or "Copy Album link" ...)
- Type: `spotify`
- Default Sizes: 350x380
- Options: Not supported
```html
<a href="https://open.spotify.com/album/6GOR8TzS51xkdUCOfM4KjX" data-popreactrox="spotify"><img src="path/to/thumbnail" /></a>
```

### Vimeo Videos

- Link format: `http://vimeo.com/xxxxxxxx` (found via the "Share" button under "Link")
- Type: `vimeo`
- Default Size: 800x480
- Options: [Vimeo Parameters](https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Using-Player-Parameters)
```html
<a href="https://vimeo.com/17160715" data-popreactrox="vimeo,100%x85%,autoplay=1&#t=85s"><img src="path/to/thumbnail" /></a>
```

### YouTube Videos

- Link format: `http://youtu.be/xxxxxxxx` (found via the "Share" button)
- Type: `youtube`
- Default sizes: 800x480
- Options: [Youtube Parameters](https://developers.google.com/youtube/player_parameters#Parameters)
```html
<a href="https://youtu.be/6JQm5aSjX6g" data-popreactrox="youtube,800x600,autoplay=1&mute=1"><img src="path/to/thumbnail" /></a>
```

### Ignore

This type tells PopReactrox to treat whatever's in anchor's href as if it were a normal link.

- Link format: Anything.
- Type: `ignore`
- Options: Not supported
```html
<a href="https://reactjs.org" data-popreactrox="ignore"><img src="path/to/thumbnail" /></a>
```

## Custom style

Are you not satisfied with the customization possibilities offered by the PopReactrox's props? 
- Set `usePopupDefaultStyling` to **false**
- Assign a custom selector to internal popup components you want to customize through `popupSelector`, `popupLoaderSelector`, `popupCloserSelector`, `popupCaptionSelector`, `popupNavPreviousSelector`, `popupNavNextSelector`
- Point to the assigned selectors in your own external style sheet

<p align="center">
  <img width="840" height="450" src="https://react-media-gallery.s3.eu-west-3.amazonaws.com/custom_style-opt.gif"></img>
</p>

## Test

Tested through Jest and Enzyme.

```bash
npm run test
```

## License

MIT Licensed. Copyright (c) Mirko Monaco 2019.