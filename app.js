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
  "defaultColor": "rgba(0, 200, 0, 0.50)",
  "defaultSelection": "rgb",
  "defaultHexAlphaChange": "rgb",
  "onHexSetAlphaToOne": true,
  "instantReload": true,
  "showCopy": true,
  "darkMode": false
};

const cp2 = new ColorPicker(label2, input2, settings2);


cp2.setColor("#rgba(0, 200, 0, 0.3)");
