# ColorPicker
I found a picture of a colorpicker somewhere a long time ago and I thought I could probably made that, so I did. It is still a work in progress.



## Features
- Find new colors using the sliders
- Paste and use already existing colors
- Convert colors between `hex`, `rgb` and  `hsl`
- Automatic updates while typing
- Input Validation
- Customizable behaviour
- Choose a default color



## Requirements
This project uses HTML5 Canvas, Regex Patterns and ES6 syntax.



## How to use
Load the css and javascript files
```
<link rel="stylesheet" href="PATH_TO_FILE/colorpicker.css">
```
```
<script src="PATH_TO_FILE/colorpicker.js" defer></script>
```
Both the label and input are **required**.
```
<div id="colorpicker-label" class="md-colorpicker-label"></div>
<input id="colorpicker-input" class="md-colorpicker-input" type="text">
```
```
var label = document.getElementById("colorpicker-label");
var input = document.getElementById("colorpicker-input");

```
```
var colorpicker = new ColorPicker(label, input);
```



## Settings
Just insert the settings as the third inparameter when creating the colorpicker. If a specific setting is not set the colorpicker will use the default settings.

```
var settings = {
  "defaultColor": "#565656",
  "defaultSelection": "rgb",
  "defaultHexAlphaChange": "rgb",
  "onHexSetAlphaToOne": true,
  "instantReload": false,
  "showCopy": true
};
```
```
var colorpicker = new ColorPicker(label, input, settings);
```

### Options
`defaultColor` | string | default: `#ff0000` <br>
accepts `hex` | `rgb` | `rgba` | `hsl` | `hsla` <br>
When loading the colorpicker for the first time, this is the default color it will display. <br>


`defaultSelection` | string | default: `hex` <br>
accepts `hex` | `rgb` | `hsl` <br>
When loading the colorpicker for the first time, this is the value type that will be displayed in the input field. <br>


`defaultHexAlphaChange` | string | default: `rgb` <br>
accepts `hex` | `rgb` | `hsl` <br>
When `hex` is selected and user changes the `alpha` value, the currently selected type will change to.. <br>

`onHexSetAlphaToOne` | bool | default: `true` <br>
When the user choose to display HEX value in the colorpicker, automatically set alpha to 1

`instantReload` | bool | default: `false` <br>
If set to true the colorpicker will update every time a user type something in to the input field. If set to `false` the user have to press `enter` to update the current color.

`showCopy` | bool | default: `true` <br>
The clipboard function is still fairly new and the support is lacking, if you want to turn it off, set this to `false`.




## ToDo
- Touch Friendly, right now it 'works' but it's not a good experience
- Input text on open picker
- Functions - `setColor` ex. `colorpicker.setColor("value");`
- Settings - BackgroundColor
