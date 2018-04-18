const label = document.getElementById("colorpicker-label");
const input = document.getElementById("colorpicker-input");
const settings = {
  "defaultColor": "#565656",
  "defaultSelection": "hex",
  "defaultHexAlphaChange": "rgb",
  "instantReload": false,
  "showCopy": true,
  "onHexSetAlphaToOne": true
};

const cp = new ColorPicker(label, input, settings);



const label2 = document.getElementById("colorpicker-label2");
const input2 = document.getElementById("colorpicker-input2");
const settings2 = {
  "defaultColor": "rgba(255, 0, 0, 0.5)",
  "defaultSelection": "rgb",
  "defaultHexAlphaChange": "rgb",
  "instantReload": true,
  "showCopy": true,
  "onHexSetAlphaToOne": true,
  "backgroundColor": "#ff0000"
};

const cp2 = new ColorPicker(label2, input2, settings2);


cp2.setColor("#ff0000");
