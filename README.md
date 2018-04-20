# ColorPicker
I found a picture of a colorpicker somewhere a long time ago and I thought I could probably made that, so I did. It is still a work in progress. <br>

You can find a working demo [here](https://tomkaar.github.io/colorpicker/)



## Features
- Find new colors using the sliders
- Paste and use existing colors
- Convert colors between `hex`, `rgb` and `hsl`
- Color Value Validation
- Update colorpicker using code/ functions
- Customizable behaviour/ settings



## Requirements
This project uses HTML5 Canvas, Regex Patterns and ES6 syntax.



## Basic usage
Load the css and javascript files and create a label and input field and use them to create a colorpicker.
```
<link rel="stylesheet" href="colorpicker.css">
<script src="colorpicker.js"></script>
```
```
<div id="label" class="md-colorpicker-label"></div>
<input id="input" class="md-colorpicker-input" type="text">
```
```
var label = document.getElementById("label");
var input = document.getElementById("input");

var colorpicker = new ColorPicker(label, input);
```



## Settings
Insert the settings as the third parameter when creating the colorpicker. If a specific setting is not set the colorpicker will use the default settings.

```
var settings = {
  "defaultColor": "#565656",
  "defaultSelection": "rgb",
  "defaultHexAlphaChange": "rgb",
  "onHexSetAlphaToOne": true,
  "instantReload": false,
  "showCopy": true,
  "darkMode": true
};
```
```
var colorpicker = new ColorPicker(label, input, settings);
```

### Options
**Default Color** <br> When loading the colorpicker for the first time, this is the default color it will display. Set to `#ff0000` by default.
```
defaultColor: "hex | rgb | rgba | hsl | hsla"
```

<br>

**Default Selection** <br> When loading the colorpicker for the first time, this is the value type that will be displayed in the input field. If the type don't match the `defaultColor` input the colorpicker will convert the value and print the type you choose here. Set to `hex` by default.
```
defaultSelection: "hex | rgb | hsl"
```

<br>

**Default Hex Alpha Change** <br> When `hex` is selected and user changes the `alpha` value, the currently selected type will change to this value. Set to `rgb` by default.
```
defaultHexAlphaChange: "hex | rgb | hsl"
```

<br>

**On Hex Set Alpha To One** <br> When the user choose to display HEX value in the colorpicker, automatically set alpha to 1 if the alpha value is not 1. Set to `true` by default.
```
onHexSetAlphaToOne: "true | false"
```

<br>

**Instant Reload** <br> If set to `true`, the colorpicker will update every time a user type something in to the input field. If set to `false` the user have to press `enter` to update the current color. Set to `false` by default.
```
instantReload: "true | false"
```

<br>

**Show Copy Button** <br> The clipboard function is still fairly new and the support is lacking, if you want to turn it off, set this to `false`. Set to `true` by default.
```
showCopy: "true | false"
```
<br>

**Dark mode** <br> What the colorpicker to match you dark theme? `false` by default.
```
darkMode: "true | false"
```

<br>

## Functions
You might want to change or update the colorpicker using code.


This function will validate the input and if the validation returns true, update the colorpickers current color. This will update the input text and label. It accepts `hex` | `rgb` | `rgba` | `hsl` | `hsla` values as a `string`.
```
colorpicker.setColor("VALUE");
```

<br>




## ToDo
- Input text on open picker



## Things to consider
- Switch from Canvas to Gradients for better browser support
