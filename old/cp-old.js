





class ColorPicker {

  constructor(ele, label, input = null) {

    // set properties
    this.elements = {
      "object": ele,
      "label": label,
      "input": input,
      "hueMarker": "=",
      "spectrumMarker": "=",
      "alphaMarker": "=",
      "colorBox": "=",
      "spectrum": "=",
      "hue": "=",
      "alpha": "="
    }

    this.values = {
      "spectrum": [255, 0, 0, 1],
      "hue": [255, 0, 0, 1],
      "alpha": 1
    }

    this.positions = {
      "spectrum" : {"x": 255, "y": 0},
      "hue" : {"x": 0, "y": 20},
      "alpha": {"x": 0, "y": 20}
    }

    this.colors = {
      "hex": "hexhex",
      "rgba": "",
      "hsla": ""
    }

    this.settings = {
      "move": false
    }

    this.info = {
      "currentlySelected" : "hex",
      "colorInput": "value",
      "colorOutput": "value"
    }

    this.currentlySelected = "hex";

    // create new
    let spectrum = this.createCanvas("spectrum", 255, 255, "spectrum");
    let hue = this.createCanvas("hue", 30, 255, "hue");
    let alpha = this.createCanvas("alpha", 30, 255, "alpha");
    let colorBox = this.createColorBox();
    let buttons = this.createButtons();

    this.createLabel();

    // append to object
    this.elements.object.append(colorBox);
    this.elements.object.append(spectrum);
    this.elements.object.append(hue);
    this.elements.object.append(alpha);
    this.elements.object.append(buttons);

    // set markers
    this.elements.spectrumMarker = spectrum.lastChild;
    this.elements.hueMarker = hue.lastChild;
    this.elements.alphaMarker = alpha.lastChild;

    // update with default values
    this.updateHue();
    this.updateSpectrum(this.values.spectrum);
    this.updateAlpha(this.values.hue);
    this.updateColorBoxes();
    this.updateOutput("y");
  }



  // update properties
  updateProperties(){

    // get and update values
    let hue = this.getHueValues();
    this.updateSpectrum(hue);

    let spectrum = this.getSpectrumValues();
    this.updateAlpha(spectrum);

    this.getAlphaValues();

    // Update ColorBox
    this.updateColorBoxes();

  }


  // set position
  setPosition(){
    // find value
    var value = this.elements.input.value;

    // convert value
    var hex = /\b#?([0-9A-Fa-f]){6}\b/g;
    var rgb = /([R][G][B][(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])[)])/i;
    var rgba = /([R][G][B][A][(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{0,300})|(0)|(1\.[0-9]{0,300})|(1)))[)])/i;
    var hsl = /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\)/g;
    var hsla = /hsla\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?)\)/g;

    var newValue = "";

    if (hex.test(value)) {
      let rgb = convert.hexToRgb(value);
      let hsv = convert.rgbToHsv(rgb.r, rgb.g, rgb.b);
      let data = {"h": hsv.h, "s": hsv.s, "v": hsv.v, "a": 1};
      newValue = data;
    }
    else if (rgb.test(value)) {
      let a = value.indexOf("(") + 1;
      let b = value.indexOf(")");
      let c = value.substring(a, b);
      let d = c.split(",");

      let hsv = convert.rgbToHsv(d[0], d[1], d[2]);
      let data = {"h": hsv.h, "s": hsv.s, "v": hsv.v, "a": 1};

      newValue = data;
    }
    else if (rgba.test(value)) {
      let a = value.indexOf("(") + 1;
      let b = value.indexOf(")");
      let c = value.substring(a, b);
      let d = c.split(",");

      let hsv = convert.rgbToHsv(d[0], d[1], d[2]);
      let data = {"h": hsv.h, "s": hsv.s, "v": hsv.v, "a": d[3]};

      newValue = data;
    }
    else if (hsl.test(value)) {
      let a = value.indexOf("(") + 1;
      let b = value.indexOf(")");
      let c = value.substring(a, b);
      let d = c.split(",");

      let rgb = convert.hslToRgb(d[0]/360, d[1].replace("%", "")/100, d[2].replace("%", "")/100);
      let hsv = convert.rgbToHsv(rgb.r, rgb.g, rgb.b);
      let data = {"h": hsv.h, "s": hsv.s, "v": hsv.v, "a": 1};

      newValue = data;
    }
    else if (hsla.test(value)) {
      let a = value.indexOf("(") + 1;
      let b = value.indexOf(")");
      let c = value.substring(a, b);
      let d = c.split(",");

      let rgb = convert.hslToRgb(d[0]/360, d[1].replace("%", "")/100, d[2].replace("%", "")/100);
      let hsv = convert.rgbToHsv(rgb.r, rgb.g, rgb.b);
      let data = {"h": hsv.h, "s": hsv.s, "v": hsv.v, "a": d[3]};

      newValue = data;
    }
    else {
      console.log("What have you done??!");
    }

    this.setPosition2(newValue.h, newValue.s, newValue.v, newValue.a);

  }


  setPosition2(h, s, v, a){

    // update hue (px)
    let hueMarker = this.elements.hueMarker;
    let hue = 255 - (255 * (h / 360));

    if(h == 255){ hue = hue - 0.6; }
    if(h == 0){ hue = hue - 0.6; }

    this.positions.hue.y = hue;
    hueMarker.style.top = hue + "px";

    // update alpha (px)
    let alphaMarker = this.elements.alphaMarker;
    let alpha = 255 - (255 * a);

    if(a = 255){ alpha = alpha - 0.6; }
    if(a = 0){ alpha = alpha - 0.6; }

    this.positions.alpha.y = alpha.toFixed(0);
    alphaMarker.style.top = alpha.toFixed(0) + "px";

    // update spectrum (px)
    let marker = this.elements.spectrumMarker;

    let coordiantes = {
      "x": 255 * (s / 100 ),
      "y": 255 * ((100 - v) / 100)
    };

    let newXValue = coordiantes.x - 1;
    let newYValue = coordiantes.y + 1;

    if(coordiantes.x == 255) { coordiantes.x = newXValue; }
    if(coordiantes.y == 0) { coordiantes.y = newYValue; }

    marker.style.left = coordiantes.x + "px";
    marker.style.top = coordiantes.y + "px";

    this.positions.spectrum.x = coordiantes.x;
    this.positions.spectrum.y = coordiantes.y;

    // update all properties
    this.updateProperties();

  }

  // find values
  getHueValues(){
    let ele = this.elements.hue;
    let pos = this.positions.hue;
    let ctx = ele.getContext('2d');

    let coordiantes = { "x": pos.x, "y": pos.y };
    let resp = ctx.getImageData(coordiantes.x, coordiantes.y, 1, 1);
    let data = [resp.data[0], resp.data[1], resp.data[2], resp.data[3]];

    this.values.hue = data;

    return data;
  }
  getSpectrumValues(){
    let ele = this.elements.spectrum;
    let pos = this.positions.spectrum;
    let ctx = ele.getContext('2d');

    let coordiantes = { "x": pos.x, "y": pos.y };
    let resp = ctx.getImageData(coordiantes.x, coordiantes.y, 1, 1);
    let data = [resp.data[0], resp.data[1], resp.data[2], resp.data[3]];

    this.values.spectrum = data;

    return data;
  }
  getAlphaValues(){
    let ele = this.elements.alpha;
    let pos = this.positions.alpha;

    let coordiantes = { "x": pos.x, "y": pos.y };

    let height = ele.height;
    let currentPos = pos.y;
    let percentage = (currentPos / height * -1 + 1);

    this.values.alpha = percentage;

    return percentage;
  }

  // Update elements on screen
  updateSpectrum(Color){
    let ele = this.elements.spectrum;
    var ctx = ele.getContext('2d');
    var ctx2 = ele.getContext('2d');

    ctx.clearRect(0, 0, 1, 1);
    ctx2.clearRect(0, 0, 1, 1);

    let rgba = "rgba(" + Color[0] + ", " + Color[1] + ", " + Color[2] + ", 1)";

    // create background with selected color from hue
    ctx.fillStyle = rgba;
    ctx.fillRect(0, 0, 255, 255);

    // create white gradient
    var grdWhite = ctx2.createLinearGradient(0, 0, 255, 0);
    grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
    grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grdWhite;
    ctx.fillRect(0, 0, 255, 255);

    // create black gradient
    var grdBlack = ctx2.createLinearGradient(0, 0, 0, 255);
    grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
    grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = grdBlack;
    ctx.fillRect(0, 0, 255, 255);
  };
  updateHue(){
    let ele = this.elements.hue;
    let ctx = ele.getContext('2d');

    ctx.rect(0, 0, 30, 255);
    var grd = ctx.createLinearGradient(0, 0, 0, 255);
    // grd.addColorStop(0, 'rgba(255, 0, 0, 1)');
    // grd.addColorStop(0.17, 'rgba(255, 0, 255, 1)');
    // grd.addColorStop(0.34, 'rgba(0, 0, 255, 1)');
    // grd.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    // grd.addColorStop(0.68, 'rgba(0, 255, 0, 1)');
    // grd.addColorStop(0.85, 'rgba(255, 255, 0, 1)');
    // grd.addColorStop(1, 'rgba(255, 0, 0, 1)');
    grd.addColorStop(.01, "rgba(255, 0, 0, 1.000)");
    grd.addColorStop(.167, "rgba(255, 0, 255, 1.000)");
    grd.addColorStop(.333, "rgba(0, 0, 255, 1.000)");
    grd.addColorStop(.5, "rgba(0, 255, 255, 1.000)");
    grd.addColorStop(.666, "rgba(0, 255, 0, 1.000)");
    grd.addColorStop(.832, "rgba(255, 255, 0, 1.000)");
    grd.addColorStop(.999, "rgba(255, 0, 0, 1.000)");
    ctx.fillStyle = grd;
    ctx.fill();

  };
  updateAlpha(Color){
    let ele = this.elements.alpha;
    let ctx = ele.getContext('2d');

    ctx.clearRect(0, 0, 30, 255);

    let rgba1 = "rgba(" + Color[0] + ", " + Color[1] + ", " + Color[2] + ", 1)";
    let rgba2 = "rgba(" + Color[0] + ", " + Color[1] + ", " + Color[2] + ", 0)";

    ctx.rect(0, 0, 30, 255);
    let grd = ctx.createLinearGradient(0, 0, 0, 255);
      grd.addColorStop(0,  rgba1);
      grd.addColorStop(1, rgba2);
    ctx.fillStyle = grd;
    ctx.fill();
  };

  updateColorBoxes(){
    let color = this.values.spectrum;
    let alpha = this.values.alpha;

    let hexData = convert.rgbToHex(color[0], color[1], color[2]);
    let hslData = convert.rgbToHsl(color[0], color[1], color[2]);

    let hex = hexData;
    let hsla = "hsla(" + hslData[0].toFixed(0) + ", " + hslData[1].toFixed(0) + "%, " + hslData[2].toFixed(0) + "%, " + alpha.toFixed(2) + ")";
    let rgba = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + alpha.toFixed(2) + ")";


    let ele = this.elements.colorBox;
      ele.style.background = rgba;
      ele.children[0].innerHTML = hex;
      ele.children[1].innerHTML = rgba;
      ele.children[2].innerHTML = hsla;

    this.colors.hex = hex;
    this.colors.rgba = rgba;
    this.colors.hsla = hsla;
  };
  updateOutput(status = "u"){
    if(this.elements.input != null){

      let newValue = "";

      if (this.info.currentlySelected == "hex") {
        newValue = this.colors.hex;
        this.info.colorOutput = this.colors.hex;
      }
      if (this.info.currentlySelected == "rgb") {
        newValue = this.colors.rgba;
        this.info.colorOutput = this.colors.rgba;
      }
      if (this.info.currentlySelected == "hsl") {
        newValue = this.colors.hsla;
        this.info.colorOutput = this.colors.hsla;
      }

      if(status == "y"){
        this.elements.input.value = newValue;
        this.elements.object.classList.remove("active");
        let label = this.elements.label;
        label.style.background = newValue;

        this.setPosition();
      }
      if(status == "n"){
        this.elements.object.classList.remove("active");
      }

    }
  }

  // create new elements
  createCanvas(className, width, height, name){
    let div = document.createElement("div");
      div.setAttribute("class", className + "Container colorpicker-canvas");
      div.setAttribute("width", width);
      div.setAttribute("height", height);
      div.setAttribute("style", "position: relative; float: left;");

    let marker = document.createElement("div");

    let ele = document.createElement("canvas");
      ele.setAttribute("class", className);
      ele.setAttribute("width", width);
      ele.setAttribute("height", height);

    var ctx = ele.getContext('2d');

    switch (name) {

      case "spectrum":
        marker.setAttribute("class", className + " crossMarker");
        marker.setAttribute("style", "top: 0px; left: 245px; ");
        this.elements.spectrum = ele;

        ele.addEventListener('mousedown', (e) => { this.settings.move = true; });
        ele.addEventListener('mouseup', (e) => { this.settings.move = false; });
        ele.addEventListener('mouseleave', (e) => { this.settings.move = false; });

        ele.addEventListener('mousemove', (e) => {
          if(this.settings.move){
            // update positon
            let coordiantes = { "x": e.layerX, "y": e.layerY };
            this.positions.spectrum.x = coordiantes.x;
            this.positions.spectrum.y = coordiantes.y;

            // move marker
            marker.setAttribute("style", "top: " + (e.layerY) + "px; left: " + (e.layerX) + "px; ");

            // update properties
            this.updateProperties();
          }
        });
        ele.addEventListener('click', (e) => {
          // update positon
          let coordiantes = { "x": e.layerX, "y": e.layerY };
          this.positions.spectrum.x = coordiantes.x;
          this.positions.spectrum.y = coordiantes.y;

          // move marker
          marker.setAttribute("style", "top: " + (e.layerY) + "px; left: " + (e.layerX) + "px; ");

          // update properties
          this.updateProperties();
        });
      break;

      case "hue":
        marker.setAttribute("class", className + " barMarker");
        marker.setAttribute("style", "top: 0; right: 0; ");
        this.elements.hue = ele;

        ele.addEventListener('mousedown', (e) => { this.settings.move = true; });
        ele.addEventListener('mouseup', (e) => { this.settings.move = false; });
        ele.addEventListener('mouseleave', (e) => { this.settings.move = false; });
        ele.addEventListener('mousemove', (e) => {
          if(this.settings.move){
            // update position
            let coordiantes = { "x": e.layerX, "y": e.layerY };
            this.positions.hue.x = coordiantes.x;
            this.positions.hue.y = coordiantes.y;

            // move marker
            marker.setAttribute("style", "top: " + (e.layerY) + "px;");

            // update properties
            this.updateProperties();
          }
        });
        ele.addEventListener('click', (e) => {
          // update position
          let coordiantes = { "x": e.layerX, "y": e.layerY };
          this.positions.hue.x = coordiantes.x;
          this.positions.hue.y = coordiantes.y;

          // move marker
          marker.setAttribute("style", "top: " + (e.layerY) + "px;");

          // update properties
          this.updateProperties();
        });
      break;

      case "alpha":
        marker.setAttribute("class", className + " barMarker");
        marker.setAttribute("style", "top: 0; right: 0; ");
        this.elements.alpha = ele;

        ele.addEventListener('mousedown', (e) => { this.settings.move = true; });
        ele.addEventListener('mouseup', (e) => { this.settings.move = false; });
        ele.addEventListener('mouseleave', (e) => { this.settings.move = false; });
        ele.addEventListener('mousemove', (e) => {
          if(this.settings.move){
            // update position
            let coordiantes = { "x": e.layerX, "y": e.layerY };
            this.positions.alpha.x = coordiantes.x;
            this.positions.alpha.y = coordiantes.y;

            // move marker
            marker.setAttribute("style", "top: " + (e.layerY) + "px;");

            // update properties
            this.updateProperties();
          }
        });
        ele.addEventListener('click', (e) => {
          // update position
          let coordiantes = { "x": e.layerX, "y": e.layerY };
          this.positions.alpha.x = coordiantes.x;
          this.positions.alpha.y = coordiantes.y;

          // move marker
          marker.setAttribute("style", "top: " + (e.layerY) + "px;");

          // update properties
          this.updateProperties();
        });
      break;

    }

    div.append(ele);
    div.append(marker);

    return div;
  }
  createColorBox(){
    let color = this.values.spectrum;
    let alpha = this.values.alpha;

    let ele = document.createElement("div");
      ele.setAttribute("class", "colorBox");

    let buttons = document.createElement("div");
      buttons.setAttribute("class", "colorBoxBtns")
    let hexButton = document.createElement("button");
      hexButton.innerHTML = "HEX";
      hexButton.setAttribute("class", "active");
    let rgbButton = document.createElement("button");
      rgbButton.innerHTML = "RGBA";
    let hslButton = document.createElement("button");
      hslButton.innerHTML = "HSL";

      hexButton.addEventListener("click", (e) =>{
        hexDiv.classList.add("active");
        rgbDiv.classList.remove("active");
        hslDiv.classList.remove("active");
        hexButton.classList.add("active");
        rgbButton.classList.remove("active");
        hslButton.classList.remove("active");
        this.info.currentlySelected = "hex";
        this.updateOutput();
      });
      rgbButton.addEventListener("click", (e) =>{
        hexDiv.classList.remove("active");
        rgbDiv.classList.add("active");
        hslDiv.classList.remove("active");
        hexButton.classList.remove("active");
        rgbButton.classList.add("active");
        hslButton.classList.remove("active");
        this.info.currentlySelected = "rgb";
        this.updateOutput();
      });
      hslButton.addEventListener("click", (e) =>{
        hexDiv.classList.remove("active");
        rgbDiv.classList.remove("active");
        hslDiv.classList.add("active");
        hexButton.classList.remove("active");
        rgbButton.classList.remove("active");
        hslButton.classList.add("active");
        this.info.currentlySelected = "hsl";
        this.updateOutput();
      });

    let hexDiv = document.createElement("div");
      hexDiv.setAttribute("class", "hexDiv active");
    let hexText = document.createElement("p");

    let rgbDiv = document.createElement("div");
      rgbDiv.setAttribute("class", "rgbDiv");
    let rgbText = document.createElement("p");

    let hslDiv = document.createElement("div");
      hslDiv.setAttribute("class", "hslDiv");
    let hslText = document.createElement("p");

    let text = document.createElement("p");
      text.innerHTML = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + alpha + ")";

    buttons.append(hexButton);
    buttons.append(rgbButton);
    buttons.append(hslButton);

    ele.append(hexDiv);
    ele.append(rgbDiv);
    ele.append(hslDiv);
    ele.append(buttons);

    this.elements.colorBox = ele;

    return ele;
  }
  createButtons(){
    let ele = document.createElement("div");
      ele.setAttribute("class", "buttons");

    let cancel = document.createElement("button");
      cancel.innerHTML = "Cancel";

    let confirm = document.createElement("button");
      confirm.innerHTML = "Select";

      cancel.addEventListener('click', (e) => {
        this.updateOutput("n");
      });

      confirm.addEventListener('click', (e) => {
        this.updateOutput("y");
      });

    ele.append(cancel);
    ele.append(confirm);

    return ele;
  }
  createLabel(){
    let ele = this.elements.label;
    ele.addEventListener('click', (e) => {
      this.elements.object.classList.toggle("active");
      // get current color
      let color = this.elements.label.style.backgroundColor;
      this.info.colorInput = color;

      this.setPosition();
    });
  }

}





var convert = ( function(){

  var rgbToHsl = function(r, g, b){
    var r = r/255;
    var g = g/255;
    var b = b/255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);

    var h = (max + min) / 2;
    var s = (max + min) / 2;
    var l = (max + min) / 2;

    if(max == min){
      h = 0;
      s = 0;
    }
    else {
      var d = max - min;

      if(l > 0.5){
        s = d / (2 - max - min)
      } else {
        s = d / (max + min);
      }

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    h = (h * 360);
    s = (s * 100);
    l = (l * 100);

    return [ h, s, l ];
  }

  var rgbToHex = function(r, g, b){

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

  };

  var hexToRgb = function(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  };

  var hslToRgb = function(h, s, l){

    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { "r" : parseInt(r * 255), "g": parseInt(g * 255), "b": parseInt(b * 255) };
  }

  var rgbToHsv = function(r, g, b){
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return {"h": h*360, "s": s*100, "v": v*100};
  }


  return {
    rgbToHsl: rgbToHsl,
    rgbToHex: rgbToHex,
    hexToRgb: hexToRgb,
    hslToRgb: hslToRgb,
    rgbToHsv: rgbToHsv
  };

})();









var pos = document.getElementById("colorpicker");
var label = document.getElementById("colorpicker-label");
var input = document.getElementById("colorpicker-input");

// var cp = new ColorPicker(pos, label, input);





// var pos2 = document.getElementById("colorpicker2");
// var label2 = document.getElementById("colorpicker2-label");
// var input2 = document.getElementById("colorpicker2-input");
//
// var cp2 = new ColorPicker(pos2, label2, input2);
