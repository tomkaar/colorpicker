class ColorPicker {

  constructor(label, input, setting = null){

    // settings
    this.settings = {
      "defaultSelection": "rgb",
      "defaultHexAlphaChange": "rgb",
      "instantReload": false,
      "showCopy": true,
      "onHexSetAlphaToOne": true,
      "darkMode": false,
      "defaultColor": {
        "hsv":  {"h": 0, "s": 100, "v": 100},
        "alpha": 1
      }
    };

    // current
    this.session = {
      "change": false, // If change
      "open": false, // if picker is open (true)
      "move": false, // if user should be able to drag a marker
      "moveAlpha": false, // if user should be able to drag a marker
      "moveHue": false, // if user should be able to drag a marker
      "moveSpectrum": false, // if user should be able to drag a marker
      "selected": "hex", // currently selected type (results)
      currentColor: {
        "hsv":  {"h": 0, "s": 100, "v": 100},
        "alpha": 1
      }
    };

    this.info = {
      "patterns": {
        "hex": /^[#]([0-9A-Fa-f]){6}$/i,
        "rgb": /([R][G][B][(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])[)]);?/i,
        "rgba": /([R][G][B][A][(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{0,300})|(0)|(1\.[0-9]{0,300})|(1)))[)]);?/i,
        "hsl": /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\);?/i,
        "hsla": /hsla\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?)\)[;]?/i
      }
    };

    // elements
    this.ele = {
      "label": label,
      "input": input,
      "object": "",
      "container": "",
      "results": {
        "object": "",
        "view": "",
        "copy": "",
        "buttons": "",
        "hexView": "",
        "rgbView": "",
        "hslView": "",
        "hexBtn": "",
        "rgbBtn": "",
        "hslBtn": ""
      },
      "picker": "",
      "cancel": "",
      "select": "",
      "flashMessage": ""
    };

    // spectrum
    this.spectrum = {
      "object": "",
      "marker": "",
      "width": 255,
      "height": 255,
      "pos": {"x": 10, "y": 245}
    };
    this.hue = {
      "object": "",
      "marker": "",
      "width": 30,
      "height": 255,
      "pos": {"x": 10, "y": 20}
    };
    this.alpha = {
      "object": "",
      "marker": "",
      "width": 30,
      "height": 255,
      "pos": {"x": 10, "y": 20}
    };

    this.convert = ( function(){

      var rgbToHsl = function(r, g, b){
        r = r/255;
        g = g/255;
        b = b/255;

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
            s = d / (2 - max - min);
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

        return { "h": h, "s": s, "l": l };
      };
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
            "r": parseInt(result[1], 16),
            "g": parseInt(result[2], 16),
            "b": parseInt(result[3], 16)
        } : null;
      };
      var hslToRgb = function(h, s, l){

        var r, g, b;

        function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        }

        if (s == 0) {
          r = g = b = l; // achromatic
        } else {

          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;

          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
        }

        return {
          "r" : Number(r * 255),
          "g": Number(g * 255),
          "b": Number(b * 255)
        };
      };
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
      };
      var hsvToRgb = function(h, s, v) {
        var r, g, b;
        var i;
        var f, p, q, t;

        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        v = Math.max(0, Math.min(100, v));

        s /= 100;
        v /= 100;

        if(s == 0) {
            // Achromatic (grey)
            r = g = b = v;
            return {
              "r": Math.round(r * 255),
              "g": Math.round(g * 255),
              "b": Math.round(b * 255)
            };
        }

        h /= 60; // sector 0 to 5
        i = Math.floor(h);
        f = h - i; // factorial part of h
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch(i) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            default: r = v; g = p; b = q;
        }

        return {
            "r": Math.round(r * 255),
            "g": Math.round(g * 255),
            "b": Math.round(b * 255)
        };
      };

      return {
        rgbToHsl: rgbToHsl,
        rgbToHex: rgbToHex,
        hexToRgb: hexToRgb,
        hslToRgb: hslToRgb,
        rgbToHsv: rgbToHsv,
        hsvToRgb: hsvToRgb
      };

    })();

    // create new colorpicker
    this.setting(setting);
    this.create();

  }

  // when the user opens and closes the picker
  userOpen(){
    if(this.session.open == false){
      this.session.change = false;
      this.session.open = true;
      this.ele.object.classList.add("active");

      let input = this.ele.input.value;
      let valid = this.validateValue((input).trim());

      var hsv;
      var alpha = 1;

      if(valid.status == "valid"){
        hsv = this.convertValue(input, valid.type, "hsv");
        if(valid.type == "rgba" || valid.type == "hsla"){
          alpha = this.getNumber(input, valid.type).a;
        }
      } else {
        hsv = this.settings.defaultColor.hsv;
        this.flashMessage("Oops, that value is not valid", "error", 30000);
      }

      this.session.currentColor.alpha = alpha;
      this.updatePositionFromValue(hsv, alpha);

      this.drawHue();
      this.drawSpectrum(hsv);
      this.drawAlpha(hsv);

      this.printResults(hsv);

      this.onHexAlpha(alpha);
      this.printResultsOnlyAlpha(alpha);
      this.contrast();

    }
    else {
      this.session.open = false;
      this.ele.object.classList.remove("active");
    }
  }
  userClickOnAlpha(){
    this.session.change = true;
    let pos = this.getPosition("a");
    let value = this.getValue("a", pos);
    this.printResultsOnlyAlpha(value);
    this.updateCurrent("a", value);
    this.onHexAlpha(value);
    this.contrast();
  }
  userClickOnSpectrum(){
    this.session.change = true;
    let pos = this.getPosition("s");
    let value = this.getValue("s", pos);

    this.drawAlpha(value);

    this.printResults(value);
    this.updateCurrent("c", value);
    this.contrast();
  }
  userClickOnHue(){
    this.session.change = true;
    let pos = this.getPosition("h");
    let value = this.getValue("h", pos);

    this.drawSpectrum(value);
    let sPos = this.getPosition("s");
    let spectrumValue = this.getValue("s", sPos);
    this.drawAlpha(spectrumValue);

    this.printResults(spectrumValue);
    this.updateCurrent("c", spectrumValue);
    this.contrast();
  }
  userSelect(answer = "n"){
    if(answer == "n" && this.session.change == true){
      this.session.change = false;
      this.session.open = false;
      this.ele.object.classList.remove("active");
    }
    else if (answer == "n" && this.session.change == false){
      this.session.open = false;
      this.ele.object.classList.remove("active");
    }
    else if(answer == "y" && this.session.change == true){
      let cs = this.session.selected;

      let value = "";
      let bgValue = "";

      // update label and input box
      if(cs == "hex"){
        value = this.ele.results.hexView.value;
        bgValue = this.ele.results.hexView.value;
      }
      else if (cs == "rgb"){
        value = this.ele.results.rgbView.value;
        bgValue = this.ele.results.rgbView.value;
      }
      else if (cs == "hsl"){
        value = this.ele.results.hslView.value;
        bgValue = this.ele.results.rgbView.value;
      }
      else {
        value = this.ele.results.rgbView.value;
        bgValue = this.ele.results.rgbView.value;
      }

      this.ele.input.value = value;
      this.ele.label.style.backgroundColor = bgValue;

      this.session.change = false;
      this.session.open = false;
      this.ele.object.classList.remove("active");
    }
    else if(answer == "y" && this.session.change == false){
      this.session.open = false;
      this.ele.object.classList.remove("active");
    }
  }
  userInputUpdate(){
    let input = this.ele.input.value;
    let valid = this.validateValue(input);

    var bg;
    var hsv;
    var alpha = 1;

    if(valid.status == "valid"){

        hsv = this.convertValue(input, valid.type, "hsv");
        let rgb = this.convertValue(input, valid.type, "rgba");

        if(valid.type == "rgba" || valid.type == "hsla"){
          alpha = this.getNumber(input, valid.type).a;
        }

        bg = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + "," + alpha + ")";

    } else {
      hsv = this.settings.defaultColor.hsv;
      let rgb = this.convert.hsvToRgb(hsv.h, hsv.s, hsv.v);
      bg = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 1)";
      this.flashMessage("That value is not valid", "error", 3000);
    }

    this.ele.label.style.backgroundColor = bg;

    this.updatePositionFromValue(hsv, alpha);

    this.drawHue();
    this.drawSpectrum(hsv);
    this.drawAlpha(hsv);

    this.printResults(hsv);
    this.printResultsOnlyAlpha(alpha);

    this.onHexAlpha(alpha);
    this.contrast();
  }
  userInputUpdateOpen(a = "hex"){
    let input;

    if(a == "hex"){ input = this.ele.results.hexView.value; }
    if(a == "rgb"){ input = this.ele.results.rgbView.value; }
    if(a == "hsl"){ input = this.ele.results.hslView.value; }

    let valid = this.validateValue(input);

    if(valid.status == "valid"){
      let hsv = this.convertValue(input, valid.type, "hsv");
      let alpha;

      if(a == "hex"){ alpha = 1; }
      else { alpha = this.getNumber(input, valid.type).a; }

      this.updatePositionFromValue(hsv, alpha);
      this.drawHue();
      this.drawSpectrum(hsv);
      this.drawAlpha(hsv);

      this.printResults(hsv);
      this.printResultsOnlyAlpha(alpha);

      this.session.currentColor.hsv = hsv;
      this.session.currentColor.alpha = alpha;

      this.contrast();
    }
    else {
      this.flashMessage("That value is not valid.", "error", 3000);
    }
  }

  // functions
  setColor(c){
    let valid = this.validateValue(c);
    if(valid.status == "valid"){
      this.ele.input.value = c;
      this.userInputUpdate();
    }
  }
  darkMode(a){
    if(a == true){
      this.settings.darkMode = true;
      this.ele.object.classList.add("md-colorpicker-dark");
    }
    else if(a == false) {
      this.settings.darkMode = false;
      this.ele.object.classList.remove("md-colorpicker-dark");
    }
  }


  // print && update results (c = @object {h, s, v})
  printResults(c){
    let rgb = this.convert.hsvToRgb(c.h, c.s, c.v);
    let hsl = this.convert.rgbToHsl(rgb.r, rgb.g, rgb.b);
    let hex = this.convert.rgbToHex(rgb.r, rgb.g, rgb.b);
    let alpha = this.session.currentColor.alpha;

    let rgbaFormated = "rgba(" + rgb.r.toFixed(0) + ", " + rgb.g.toFixed(0) + ", " + rgb.b.toFixed(0) + ", " + alpha.toFixed(2) + ")";
    let hslaFormated = "hsla(" + hsl.h.toFixed(0) + ", " + hsl.s.toFixed(0) + "%, " + hsl.l .toFixed(0)+ "%, " + alpha.toFixed(2) + ")";

    this.ele.results.hexView.value = hex;
    this.ele.results.hslView.value = hslaFormated;
    this.ele.results.rgbView.value = rgbaFormated;

    this.ele.results.object.style.backgroundColor = rgbaFormated;
  }
  printResultsOnlyAlpha(alpha){
    // get current values
    let cRgb = this.ele.results.rgbView.value;
    let cHsl = this.ele.results.hslView.value;

    // validate
    let validRgb = this.validateValue((cRgb).trim());
    let validHsl = this.validateValue((cHsl).trim());

    // get numbers
    let rgb = this.getNumber(cRgb, validRgb.type);
    let hsl = this.getNumber(cHsl, validHsl.type);

    // update with new numbers
    let rgbaFormated = "rgba(" + rgb.r.toFixed(0) + ", " + rgb.g.toFixed(0) + ", " + rgb.b.toFixed(0) + ", " + alpha.toFixed(2) + ")";
    let hslaFormated = "hsla(" + hsl.h.toFixed(0) + ", " + hsl.s.toFixed(0) + "%, " + hsl.l .toFixed(0)+ "%, " + alpha.toFixed(2) + ")";

    this.ele.results.hslView.value = hslaFormated;
    this.ele.results.rgbView.value = rgbaFormated;

    this.ele.results.object.style.backgroundColor = rgbaFormated;
  }
  setResultButton(a){
    this.session.change = true;

    let hexBtn = this.ele.results.hexBtn;
    let hslBtn = this.ele.results.hslBtn;
    let rgbBtn = this.ele.results.rgbBtn;

    let hexView = this.ele.results.hexView;
    let hslView = this.ele.results.hslView;
    let rgbView = this.ele.results.rgbView;

    if(a == "hex"){
      this.session.selected = "hex";
      hexBtn.classList.add("active");
      hslBtn.classList.remove("active");
      rgbBtn.classList.remove("active");
      hexView.classList.add("active");
      hslView.classList.remove("active");
      rgbView.classList.remove("active");
    }
    else if (a == "hsl") {
      this.session.selected = "hsl";
      hexBtn.classList.remove("active");
      hslBtn.classList.add("active");
      rgbBtn.classList.remove("active");
      hexView.classList.remove("active");
      hslView.classList.add("active");
      rgbView.classList.remove("active");
    }
    else if (a == "rgb") {
      this.session.selected = "rgb";
      hexBtn.classList.remove("active");
      hslBtn.classList.remove("active");
      rgbBtn.classList.add("active");
      hexView.classList.remove("active");
      hslView.classList.remove("active");
      rgbView.classList.add("active");
    }

  }
  contrast(){
    let a = this.session.currentColor.hsv;
    let b = this.session.currentColor.alpha;

    let color = this.convert.hsvToRgb(a.h, a.s, a.v);

    // Find Contrast
    let c = [ color.r/255, color.g/255, color.b/255 ];
    let newColor = "";

    for ( let i = 0; i < c.length; ++i ) {
      if ( c[i] <= 0.03928 ) {
        c[i] = c[i] / 12.92;
      } else {
        c[i] = Math.pow( ( c[i] + 0.055 ) / 1.055, 2.4);
      }
    }

    let l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    if ( l > 0.179 || b <= 0.3 ) {
      newColor = "#000000";
    } else {
      newColor = "#ffffff";
    }

    this.ele.results.hexView.style.color = newColor;
    this.ele.results.hslView.style.color = newColor;
    this.ele.results.rgbView.style.color = newColor;
    this.ele.results.hexBtn.style.color = newColor;
    this.ele.results.hslBtn.style.color = newColor;
    this.ele.results.rgbBtn.style.color = newColor;
    if(this.settings.showCopy){ this.ele.results.copy.style.color = newColor; }

  }


  // utils
  onHexAlpha(a = this.settings.onHexAlpha){
    if(this.session.selected == "hex" && this.session.currentColor.alpha != 1){
      this.settings.onHexAlpha = a;
      this.setResultButton(this.settings.defaultHexAlphaChange);
      this.session.change = true;
    }
  }
  validateValue(value){
    // test + return status + type
    if(this.info.patterns.hex.test(value)){ return {"status": "valid", "type": "hex"}; }
    else if(this.info.patterns.rgb.test(value)){ return {"status": "valid", "type": "rgb"}; }
    else if(this.info.patterns.rgba.test(value)){ return {"status": "valid", "type": "rgba"}; }
    else if(this.info.patterns.hsl.test(value)){ return {"status": "valid", "type": "hsl"}; }
    else if(this.info.patterns.hsla.test(value)){ return {"status": "valid", "type": "hsla"}; }
    else {
      return{"status": "invalid"};
    }
  }
  getNumber(value, type){
    if(type == "hex"){
      return value;
    }
    else if(type == "rgb"){
      let a = value.indexOf("(") + 1;
      let b = value.indexOf(")");
      let c = value.substring(a, b);
      let d = c.split(",");

      return {"r": Number(d[0]), "g": Number(d[1]), "b": Number(d[2])};
    }
    else if(type == "rgba"){
      let a = value.indexOf("(") + 1;
      let b = value.indexOf(")");
      let c = value.substring(a, b);
      let d = c.split(",");

      return {"r": Number(d[0]), "g": Number(d[1]), "b": Number(d[2]), "a": Number(d[3])};
    }
    else if (type == "hsl"){
      let a = value.indexOf("(") + 1;
      let b = value.indexOf(")");
      let c = value.substring(a, b);
      let d = c.split(",");

      return {"h": Number(d[0]), "s": Number(d[1].replace("%", "")), "l": Number(d[2].replace("%", ""))};
    }
    else if (type == "hsla"){
      let a = value.indexOf("(") + 1;
      let b = value.indexOf(")");
      let c = value.substring(a, b);
      let d = c.split(",");

      return {"h": Number(d[0]), "s": Number(d[1].replace("%", "")), "l": Number(d[2].replace("%", "")), "a": Number(d[3])};
    }
  }
  copy(target){

    var range = document.createRange();
    range.selectNode(target);
    window.getSelection().addRange(range);

    try {
      document.execCommand("copy");
    } catch(err) {
      this.flashMessage("Oops, unable to copy", "error", 3000);
    }

    window.getSelection().removeAllRanges();
  }
  flashMessage(message, type = "ok", time = 3000){
    this.ele.flashMessage.innerHTML = message;
    this.ele.flashMessage.classList.add("active");

    if(type == "error") { this.ele.flashMessage.style.backgroundColor = "#ff4757"; }
    else if (type == "ok") { this.ele.flashMessage.style.backgroundColor = "#2ed573"; }
    else if (type == "info") { this.ele.flashMessage.style.backgroundColor = "#70a1ff"; }
    else if (type == "warn") { this.ele.flashMessage.style.backgroundColor = "#ffa502"; }

    setTimeout(() => { this.ele.flashMessage.classList.remove("active"); }, time);
  }


  // update positions from value
  updatePositionFromValue(c, a){
    let h = c.h;
    let s = c.s;
    let v = c.v;

    // update hue
    let hueMarker = this.hue.marker;
    let hue = 255 - (255 * (h / 360));

    if(h == 255){ hue = hue - 10; }
    if(h == 0){ hue = hue - 0.6; }

    this.hue.pos.y = hue;
    hueMarker.style.top = hue + "px";

    // update alpha
    let alphaMarker = this.alpha.marker;
    let alpha = 255 - (255 * a);

    if(a == 255){ alpha = alpha - 0.6; }
    if(a == 0){ alpha = alpha - 0.6; }

    this.alpha.pos.y = alpha.toFixed(0);
    alphaMarker.style.top = alpha.toFixed(0) + "px";

    // update spectrum
    let marker = this.spectrum.marker;

    let coordiantes = {
      "x": 255 * (s / 100 ),
      "y": 255 * ((100 - v) / 100)
    };

    let newXValue = coordiantes.x - 0.00005;
    let newYValue = coordiantes.y + 0.00005;

    if(coordiantes.x == 255) { coordiantes.x = newXValue; }
    if(coordiantes.y == 0) { coordiantes.y = newYValue; }

    marker.style.left = coordiantes.x + "px";
    marker.style.top = coordiantes.y + "px";

    this.spectrum.pos.x = coordiantes.x;
    this.spectrum.pos.y = coordiantes.y;
  }
  // update position when draging the marker over the sliders
  // (touch//click eve  nt, container, marker, both(both, x, y), name of slider, if mobile)
  updateMarkerPositiononDrag(t, e, m, d = "both", x, y = "desktop"){
    // distance from container to edge of screen
    let cont = this.ele.container.getBoundingClientRect();
    // mouse position
    let c = { "x": t.clientX - e.offsetLeft, "y": t.clientY - e.offsetTop };
    // marker position
    let pos = { "x": 10, "y": 10 };

    if(y == "mobile"){
      cont.x = 0;
      cont.y = 0;
    }

    // inside -> top left c -> top right c -> bottom right c -> bottom left c -> bottom -> right -> top -> left
    if( c.x >= 0 + cont.x && c.y >= 0 + cont.y && c.x <= e.offsetWidth + cont.x && c.y <= e.offsetHeight + cont.y){ pos = {"x": c.x - cont.x, "y": c.y - cont.y}; }
    else if(c.x <= 0 + cont.x && c.y <= 0 + cont.y) { pos = {"x": 0, "y": 0}; }
    else if(c.x >= e.offsetWidth + cont.x && c.y <= 0 + cont.y){ pos = {"x": e.offsetWidth, "y": 0}; }
    else if(c.x >= e.offsetWidth + cont.x && c.y >= e.offsetHeight + cont.y){ pos = {"x": e.offsetWidth, "y": e.offsetHeight}; }
    else if(c.x <= 0 + cont.x && c.y >= e.offsetHeight + cont.y){ pos = {"x": 0, "y": e.offsetHeight}; }
    else if(c.y >= e.offsetHeight + cont.y){ pos = {"x": c.x - cont.x, "y": e.offsetHeight}; }
    else if(c.x >= e.offsetWidth + cont.x && c.y >= 0 + cont.y){ pos = {"x": e.offsetWidth, "y": c.y - cont.y}; }
    else if(c.x >= 0 + cont.x) { pos = {"x": c.x - cont.x, "y": 0}; }
    else if(c.y >= 0 + cont.y) { pos = {"x": 0, "y": c.y - cont.y}; }

    // set marker position
    if(d == "both"){ m.setAttribute("style", "top: " + (pos.y) + "px; left: " + (pos.x) + "px;"); }
    else if (d == "x"){ m.setAttribute("style", "top: " + (pos.y) + "px; left: 0px;"); }
    else if (d == "y"){ m.setAttribute("style", "top: 0px; left: " + (pos.x) + "px;"); }

    if(x == "alpha"){
      this.alpha.pos.y = pos.y;
    }
    else if (x == "hue"){
      if(pos.y == this.hue.height){
        this.hue.pos.y = pos.y - 1;
      } else {
        this.hue.pos.y = pos.y;
      }
    }
    else if (x == "spectrum"){
      if(pos.y == this.spectrum.height && pos.x == this.spectrum.width){
        this.spectrum.pos.y = pos.y - 1;
        this.spectrum.pos.x = pos.x - 0.5;
      }
      if(pos.y == this.spectrum.height){
        this.spectrum.pos.y = pos.y - 1;
        this.spectrum.pos.x = pos.x;
      }
      if(pos.x == this.spectrum.width){
        this.spectrum.pos.y = pos.y;
        this.spectrum.pos.x = pos.x - 0.5;
      }
      else {
        this.spectrum.pos.y = pos.y;
        this.spectrum.pos.x = pos.x;
      }
    }

  } // end updatePosition

  // update current value in session
  updateCurrent(t, c){
    if(t == "a"){ this.session.currentColor.alpha = c; }
    else if(t == "c"){ this.session.currentColor.hsv = {"h": c.h, "s": c.s, "v": c.v}; }
  }

  // get position (return)
  getPosition(t = "a"){
    if(t == "a"){
      let pos = this.alpha.pos;
      return pos;
    }
    else if (t == "h"){
      let pos = this.hue.pos;
      return pos;
    }
    else if (t == "s"){
      let pos = this.spectrum.pos;
      return pos;
    }
  }

  // get value (return) based of the current position of the marker (type, pos)
  getValue(t = "a", pos){
    if(t == "a"){
      let alpha = (pos.y / this.alpha.height * -1 + 1);
      return alpha;
    }
    else if (t== "h"){
      let element = this.hue.object;
      let ctx = element.getContext("2d");
      let resp = ctx.getImageData(pos.x, pos.y, 1, 1);
      let hsv = this.convert.rgbToHsv(resp.data[0], resp.data[1], resp.data[2]);

      return {"h": hsv.h, "s": hsv.s, "v": hsv.v};
    }
    else if (t == "s"){
      let element = this.spectrum.object;
      let ctx = element.getContext("2d");
      let resp = ctx.getImageData(pos.x, pos.y, 1, 1);
      let hsv = this.convert.rgbToHsv(resp.data[0], resp.data[1], resp.data[2]);

      return {"h": hsv.h, "s": hsv.s, "v": hsv.v};
    }
  }

  // convert values (c, from, to) (hex|rgb|rgba|hsl|hsla) (return)
    // accepts string values only
  convertValue(c, from, to){
    if(from == "hex"){
      if(to == "rgb"){
        return this.convert.hexToRgb(c);
      }
      if(to == "rgba"){
        let a = this.convert.hexToRgb(c);
        return {"r": a.r, "g": a.g, "b": a.b, "a": 1};
      }
      if(to == "hsl"){
        let a = this.convert.hexToRgb(c);
        return this.convert.rgbToHsl(a.r, a.g, a.b);
      }
      if(to == "hsla"){
        let a = this.convert.hexToRgb(c);
        let b = this.convert.rgbToHsl(a.r, a.g, a.b);
        return {"h": b.h, "s": b.s, "l": b.l, "a": 1};
      }
      if(to == "hsv"){
        let a = this.convert.hexToRgb(c);
        return this.convert.rgbToHsv(a.r, a.g, a.b);
      }
      if(to == "hex"){ return this.getNumber(c, from); }
    }
    if(from == "rgb"){
      if(to == "hex"){
        let a = this.getNumber(c, from);
        return this.convert.rgbToHex(a.r, a.g, a.b);
      }
      if(to == "hsl"){
        let a = this.getNumber(c, from);
        let b = this.convert.rgbToHsl(a.r, a.g, a.b);
        return {"h": b.h, "s": b.s, "l": b.l};
      }
      if(to == "hsla"){
        let a = this.getNumber(c, from);
        let b = this.convert.rgbToHsl(a.r, a.g, a.b);
        return {"h": b.h, "s": b.s, "l": b.l, "a": 1};
      }
      if(to == "hsv"){
        let a = this.getNumber(c, from);
        return this.convert.rgbToHsv(a.r, a.g, a.b);
      }
      if(to == "rgb"){ return this.getNumber(c, from); }
      if(to == "rgba"){ return this.getNumber(c, from); }
    }
    if(from == "rgba"){
      if(to == "hex"){
        let a = this.getNumber(c, from);
        return this.convert.rgbToHex(a.r, a.g, a.b);
      }
      if(to == "hsl"){
        let a = this.getNumber(c, from);
        let b = this.convert.rgbToHsl(a.r, a.g, a.b);
        return {"h": b.h, "s": b.s, "l": b.l};
      }
      if(to == "hsla"){
        let a = this.getNumber(c, from);
        let b = this.convert.rgbToHsl(a.r, a.g, a.b);
        return {"h": b.h, "s": b.s, "l": b.l, "a": a.a};
      }
      if(to == "hsv"){
        let a = this.getNumber(c, from);
        let b = this.convert.rgbToHsv(a.r, a.g, a.b);
        return {"h": b.h, "s": b.s, "v": b.v};
      }
      if(to == "rgb"){ return this.getNumber(c, from); }
      if(to == "rgba"){ return this.getNumber(c, from); }
    }
    if(from == "hsl"){
      if(to == "hex"){
        let a = this.getNumber(c, from);
        let b = this.convert.hslToRgb(a.h/360, a.s/100, a.l/100);
        return this.convert.rgbToHex(Math.round(b.r), Math.round(b.g), Math.round(b.b));
      }
      if(to == "rgb"){
        let a = this.getNumber(c, from);
        return this.convert.hslToRgb(a.h/360, a.s/100, a.l/100);
      }
      if(to == "rgba"){
        let a = this.getNumber(c, from);
        let b = this.convert.hslToRgb(a.h/360, a.s/100, a.l/100);
        return {"r": b.r, "g": b.g, "b": b.b, "a": 1};
      }
      if(to == "hsv"){
        let a = this.getNumber(c, from);
        let b = this.convert.hslToRgb(a.h/360, a.s/100, a.l/100);
        return this.convert.rgbToHsv(b.r, b.g, b.b);
      }
      if(to == "hsl"){ return this.getNumber(c, from); }
      if(to == "hsla"){ return this.getNumber(c, from); }
    }
    if(from == "hsla"){
      if(to == "hex"){
        let a = this.getNumber(c, from);
        let b = this.convert.hslToRgb(a.h/360, a.s/100, a.l/100);
        return this.convert.rgbToHex(Math.round(b.r), Math.round(b.g), Math.round(b.b));
      }
      if(to == "rgb"){
        let a = this.getNumber(c, from);
        let b = this.convert.hslToRgb(a.h/360, a.s/100, a.l/100);
        return {"r": b.r, "g": b.g, "b": b.b};
      }
      if(to == "rgba"){
        let a = this.getNumber(c, from);
        let b = this.convert.hslToRgb(a.h/360, a.s/100, a.l/100);
        return {"r": b.r, "g": b.g, "b": b.b, "a": 1};
      }
      if(to == "hsv"){
        let a = this.getNumber(c, from);
        let b = this.convert.hslToRgb(a.h/360, a.s/100, a.l/100);
        let d = this.convert.rgbToHsv(b.r, b.g, b.b);
        return {"h": d.h, "s": d.s, "v": d.v};
      }
      if(to == "hsl"){ return this.getNumber(c, from); }
      if(to == "hsla"){ return this.getNumber(c, from); }
    }
  }

  // draw (c = @object = {h, s, v} )
  drawHue(){
    let ele = this.hue.object;
    let ctx = ele.getContext("2d");

    ctx.rect(0, 0, this.hue.width, this.hue.height);
    var grd = ctx.createLinearGradient(90, 0, 90, this.hue.height);
    grd.addColorStop(.01, "rgba(255, 0, 0, 1.000)");
    grd.addColorStop(.167, "rgba(255, 0, 255, 1.000)");
    grd.addColorStop(.333, "rgba(0, 0, 255, 1.000)");
    grd.addColorStop(.5, "rgba(0, 255, 255, 1.000)");
    grd.addColorStop(.666, "rgba(0, 255, 0, 1.000)");
    grd.addColorStop(.832, "rgba(255, 255, 0, 1.000)");
    grd.addColorStop(0.99, "rgba(255, 0, 0, 1.000)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.hue.width, this.hue.height);
    ctx.fill();
  }
  drawSpectrum(c){
    let color = this.convert.hsvToRgb(c.h, c.s, c.v);
    let ele = this.spectrum.object;
    var ctx = ele.getContext("2d");
    var ctx2 = ele.getContext("2d");

    ctx.clearRect(-1, -1, 1, 1);
    ctx2.clearRect(-1, -1, 1, 1);

    // create background with color
    ctx.fillStyle = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)";
    ctx.fillRect(0, 0, this.spectrum.width, this.spectrum.height);

    // create white gradient
    var grdWhite = ctx2.createLinearGradient(0, 0, this.spectrum.width, 0);
    grdWhite.addColorStop(.01, "rgba(255,255,255,1)");
    grdWhite.addColorStop(.99, "rgba(255,255,255,0)");
    ctx.fillStyle = grdWhite;
    ctx.fillRect(-1, -1, this.spectrum.width + 2, this.spectrum.height + 2);

    // create black gradient
    var grdBlack = ctx2.createLinearGradient(0, 0, 0, this.spectrum.height);
    grdBlack.addColorStop(.01, "rgba(0,0,0,0)");
    grdBlack.addColorStop(.99, "rgba(0,0,0,1)");
    ctx.fillStyle = grdBlack;
    ctx.fillRect(-1, -1, this.spectrum.width + 2, this.spectrum.height + 2);
  }
  drawAlpha(c){
    let ele = this.alpha.object;
    let ctx = ele.getContext("2d");
    let color = this.convert.hsvToRgb(c.h, c.s, c.v);

    ctx.clearRect(0, 0, this.alpha.width, this.alpha.height);

    let rgba1 = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)";
    let rgba2 = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0)";

    ctx.rect(0, 0, 30, 255);
    let grd = ctx.createLinearGradient(0, 0, 0, this.alpha.height);
      grd.addColorStop(0,  rgba1);
      grd.addColorStop(1, rgba2);
    ctx.fillStyle = grd;
    ctx.fill();
  }

  // settings (update default settings)
  setting(settings){
    for (var key in settings){
      if (settings.hasOwnProperty(key)) {
        if(key == "defaultColor"){

          let valid = this.validateValue(settings[key]);
          var hsv, alpha = 1;

          if(valid.status == "valid"){
            hsv = this.convertValue(settings[key], valid.type, "hsv");
            if(valid.type == "rgba" || valid.type == "hsla"){
              alpha = this.getNumber(settings[key], valid.type).a;
            }
          }
          else {
            console.log("Cannot set default value on the colorpicker.");
            hsv = this.settings.defaultColor.hsv;}

          // set color
          this.settings.defaultColor.hsv = hsv;
          this.settings.defaultColor.alpha = alpha;
          this.session.currentColor.hsv = hsv;
          this.session.currentColor.alpha = alpha;
        }
        else if (key == "defaultSelection"){
          if(settings[key] == "hex" || settings[key] == "hsl" || settings[key] == "rgb"){
            this.settings.defaultSelection = settings[key];
          }
        }
        else if (key == "defaultHexAlphaChange"){
          if(settings[key] == "hex" || settings[key] == "hsl" || settings[key] == "rgb"){
            this.settings.defaultHexAlphaChange = settings[key];
          }
        }
        else if (key == "instantReload"){
          if(settings[key] == true || settings[key] == false){
            this.settings.instantReload = settings[key];
          }
        }
        else if (key == "showCopy"){
          if(settings[key] == true || settings[key] == false){
            this.settings.showCopy = settings[key];
          }
        }
        else if (key == "onHexSetAlphaToOne"){
          if(settings[key] == true || settings[key] == false){
            this.settings.onHexSetAlphaToOne = settings[key];
          }
        }
        else if(key == "darkMode"){
          if(settings[key] == true || settings[key] == false){
            if(settings[key] == true){ this.settings.darkMode = true; }
            else { this.settings.darkMode = false; }
          }
        }
      }
    }
  }

  // create elements
  create(){
    this.createLabel();
    this.createInput();
    this.createBase();
    this.createResults();
      this.createResultsViews();
      this.createResultsBtns();
      this.createCopy();
    this.createPickers();
      this.createSpectrum();
      this.createHue();
      this.createAlpha();
    this.createSelect();
    this.createFlashMessage();

    this.updatePositionFromValue(this.settings.defaultColor.hsv, this.settings.defaultColor.alpha);

    this.drawHue();
    this.drawSpectrum(this.settings.defaultColor.hsv);
    this.drawAlpha(this.settings.defaultColor.hsv);

    this.printResults(this.settings.defaultColor.hsv);
    this.printResultsOnlyAlpha(this.settings.defaultColor.alpha);

    this.setResultButton(this.settings.defaultSelection);

    this.userSelect("y");
  }
    createLabel(){
      this.ele.label.addEventListener("click", () => { this.userOpen(); });
    }
    createInput(){
      this.ele.input.addEventListener("keyup", (e) => {
        if(e.keyCode == 13 || this.settings.instantReload == true){
          this.userInputUpdate();
        }
        // validate current input and throw visible error if input is not valid
        let input = this.ele.input.value;
        let valid = this.validateValue(input);
        if(valid.status != "valid"){
          this.ele.input.classList.add("error");
        } else {
          this.ele.input.classList.remove("error");
        }
      });
    }
    createBase(){
      // wrapper (object)
      let wrapper = document.createElement("div");
        wrapper.setAttribute("class", "md-colorpicker active");
        if(this.settings.darkMode == true) { wrapper.classList.add("md-colorpicker-dark"); }
      // bg
      let bg = document.createElement("div");
        bg.setAttribute("class", "colorpicker-bg");
      // container
      let container = document.createElement("div");
        container.setAttribute("class", "colorpicker-container");

      bg.addEventListener("click", () => { this.userOpen(); });

      this.ele.object = wrapper;
      this.ele.container = container;
      // append to
      wrapper.append(bg);
      wrapper.append(container);
      document.body.append(wrapper);
    }
    createResults(){
      let container = document.createElement("div");
        container.setAttribute("class", "results");
      let view = document.createElement("div");
        view.setAttribute("class", "results-view");
      let buttons = document.createElement("div");
        buttons.setAttribute("class", "results-buttons");

      // append to
      container.append(view);
      container.append(buttons);
      this.ele.container.append(container);

      // save to
      this.ele.results.object = container;
      this.ele.results.view = view;
      this.ele.results.buttons = buttons;

    }
      createResultsViews(){
        let container = this.ele.results.view;

        let hex = document.createElement("input");
          hex.setAttribute("class", "results-view-hex active");
        let rgb = document.createElement("input");
          rgb.setAttribute("class", "results-view-rgb");
        let hsl = document.createElement("input");
          hsl.setAttribute("class", "results-view-hsl");

        hex.addEventListener("keyup", (e) => {
          if(e.keyCode == "13"){ this.userInputUpdateOpen("hex"); }
        });
        rgb.addEventListener("keyup", (e) => {
          if(e.keyCode == "13"){ this.userInputUpdateOpen("rgb"); }
        });
        hsl.addEventListener("keyup", (e) => {
          if(e.keyCode == "13"){ this.userInputUpdateOpen("hsl"); }
        });

        this.ele.results.hexView = hex;
        this.ele.results.rgbView = rgb;
        this.ele.results.hslView = hsl;

        container.append(hex);
        container.append(rgb);
        container.append(hsl);
      }
      createResultsBtns(){
        let container = this.ele.results.buttons;

        let hex = document.createElement("button");
          hex.innerHTML = "HEX";
        let rgb = document.createElement("button");
          rgb.innerHTML = "RGBA";
        let hsl = document.createElement("button");
          hsl.innerHTML = "HSLA";

        hex.addEventListener("click", () => {
          this.setResultButton("hex");
          if(this.settings.onHexSetAlphaToOne == true){
            this.printResultsOnlyAlpha(1);
            this.alpha.marker.style.top = "0px";
          }
        });
        rgb.addEventListener("click", () => { this.setResultButton("rgb"); });
        hsl.addEventListener("click", () => { this.setResultButton("hsl"); });

        this.ele.results.hexBtn = hex;
        this.ele.results.rgbBtn = rgb;
        this.ele.results.hslBtn = hsl;

        container.append(hex);
        container.append(rgb);
        container.append(hsl);
      }
      createCopy(){
        if(this.settings.showCopy == true){
          let element = document.createElement("button");
          element.setAttribute("class", "copy");
            element.innerHTML = "copy";

          element.addEventListener("click", () => {
            if(this.session.selected == "hex"){ this.copy(this.ele.results.hexView); this.copy(this.ele.results.hexView); }
            if(this.session.selected == "hsl"){  this.copy(this.ele.results.hslView); this.copy(this.ele.results.hslView); }
            if(this.session.selected == "rgb"){  this.copy(this.ele.results.rgbView); this.copy(this.ele.results.rgbView); }
          });

          this.ele.results.object.append(element);
          this.ele.results.copy = element;
        }
      }
    createPickers(){
      let container = document.createElement("div");
        container.setAttribute("class", "pickers");

      this.ele.picker = container;
      this.ele.container.append(container);
    }
      createSpectrum(){
        let container = document.createElement("div");
          container.setAttribute("class", "spectrum container");
          container.setAttribute("width", this.spectrum.width + "px");
          container.setAttribute("height", this.spectrum.height + "px");

        let spectrum = document.createElement("canvas");
          spectrum.setAttribute("width", this.spectrum.width);
          spectrum.setAttribute("height", this.spectrum.height);

        let marker = document.createElement("div");
          marker.setAttribute("class", "spectrumMarker crossMarker");
          marker.setAttribute("style", "top: 10px; left: 245px; ");

        spectrum.addEventListener("mousedown", () => { this.session.moveSpectrum = true; });
        this.ele.object.addEventListener("mouseup", () => {
          this.session.moveSpectrum = false;
          this.ele.object.classList.remove("select-none");
        });
        this.ele.object.addEventListener("mousemove", (e) => {
          if(this.session.moveSpectrum){
            this.updateMarkerPositiononDrag(e, container, marker, "both", "spectrum");
            this.userClickOnSpectrum();
            this.ele.object.classList.add("select-none");
          }
        });
        spectrum.addEventListener("click", (e) => {
          this.updateMarkerPositiononDrag(e, container, marker, "both", "spectrum");
          this.userClickOnSpectrum();
        });

        spectrum.addEventListener("touchstart", () => { this.session.moveSpectrum = true; });
        this.ele.object.addEventListener("touchend", () => {
          this.session.moveSpectrum = false;
          this.ele.object.classList.remove("select-none");
        });
        this.ele.object.addEventListener("touchmove", (e) => {
          if(this.session.moveSpectrum){
            this.updateMarkerPositiononDrag(e.touches[0], container, marker, "both", "spectrum", "mobile");
            this.userClickOnSpectrum();
            this.ele.object.classList.add("select-none");
          }
        });

        this.spectrum.object = spectrum;
        this.spectrum.marker = marker;

        container.append(spectrum);
        container.append(marker);
        this.ele.picker.append(container);
      }
      createHue(){
        let container = document.createElement("div");
          container.setAttribute("class", "hue container");
          container.setAttribute("width", this.hue.width + "px");
          container.setAttribute("height", this.hue.height + "px");

        let hue = document.createElement("canvas");
          hue.setAttribute("width", this.hue.width);
          hue.setAttribute("height", this.hue.height);

        let marker = document.createElement("div");
          marker.setAttribute("class", "spectrumMarker barMarker");
          marker.setAttribute("style", "top: 10px;");

          hue.addEventListener("mousedown", () => { this.session.moveHue = true; });
          this.ele.object.addEventListener("mouseup", () => {
            this.session.moveHue = false;
            this.ele.object.classList.remove("select-none");
          });
          this.ele.object.addEventListener("mousemove", (e) => {
            if(this.session.moveHue){
              this.updateMarkerPositiononDrag(e, container, marker, "x", "hue");
              this.userClickOnHue();
              this.ele.object.classList.add("select-none");
            }
          });
          hue.addEventListener("click", (e) => {
            this.updateMarkerPositiononDrag(e, container, marker, "x", "hue");
            this.userClickOnHue();
          });

          hue.addEventListener("touchstart", () => { this.session.moveHue = true; });
          this.ele.object.addEventListener("touchend", () => {
            this.session.moveHue = false;
            this.ele.object.classList.remove("select-none");
          });
          this.ele.object.addEventListener("touchmove", (e) => {
            if(this.session.moveHue){
            this.updateMarkerPositiononDrag(e.touches[0], container, marker, "x", "hue", "mobile");
            this.userClickOnHue();
            this.ele.object.classList.add("select-none");
          }
          });

        this.hue.object = hue;
        this.hue.marker = marker;

        container.append(hue);
        container.append(marker);
        this.ele.picker.append(container);
      }
      createAlpha(){
        let container = document.createElement("div");
          container.setAttribute("class", "alpha container");
          container.setAttribute("width", this.alpha.width + "px");
          container.setAttribute("height", this.alpha.height + "px");

        let alpha = document.createElement("canvas");
          alpha.setAttribute("width", this.alpha.width);
          alpha.setAttribute("height", this.alpha.height);

        let marker = document.createElement("div");
          marker.setAttribute("class", "spectrumMarker barMarker");
          marker.setAttribute("style", "top: 10px;");

          alpha.addEventListener("mousedown", () => { this.session.moveAlpha = true; });
          this.ele.object.addEventListener("mouseup", () => {
            this.session.moveAlpha = false;
          this.ele.object.classList.remove("select-none");
        });
          this.ele.object.addEventListener("mousemove", (e) => {
            if(this.session.moveAlpha){
              this.updateMarkerPositiononDrag(e, container, marker, "x", "alpha");
              this.userClickOnAlpha();
              this.ele.object.classList.add("select-none");
            }
          });
          alpha.addEventListener("click", (e) => {
            this.updateMarkerPositiononDrag(e, container, marker, "x", "alpha");
            this.userClickOnAlpha();
          });

          alpha.addEventListener("touchstart", () => { this.session.moveAlpha = true; });
          this.ele.object.addEventListener("touchend", () => {
            this.session.moveAlpha = false;
            this.ele.object.classList.remove("select-none");
          });
          this.ele.object.addEventListener("touchmove", (e) => {
            if(this.session.moveAlpha){
            this.updateMarkerPositiononDrag(e.touches[0], container, marker, "x", "alpha", "mobile");
            this.userClickOnAlpha();
            this.ele.object.classList.add("select-none");
          }
          });

        this.alpha.object = alpha;
        this.alpha.marker = marker;

        container.append(alpha);
        container.append(marker);
        this.ele.picker.append(container);
      }
    createSelect(){
      let container = document.createElement("div");
        container.setAttribute("class", "select");

      let cancel = document.createElement("button");
        cancel.setAttribute("class", "cancel-btn");
        cancel.innerHTML = "Cancel";

      let select = document.createElement("button");
        select.setAttribute("class", "select-btn");
        select.innerHTML = "Select";

      cancel.addEventListener("click", () => { this.userSelect("n"); });
      select.addEventListener("click", () => { this.userSelect("y"); });

      this.ele.cancel = cancel;
      this.ele.select = select;

      container.append(cancel);
      container.append(select);
      this.ele.container.append(container);
    }
    createFlashMessage(){
      let container = document.createElement("div");
        container.setAttribute("class", "flashMessage");

      this.ele.flashMessage = container;
      this.ele.container.append(container);
    }

}
