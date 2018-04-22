class ColorPicker {

  constructor(label, input, setting = null){

    // settings
    this.settings = {
      "defaultSelection": "rgb",
      "defaultHexAlphaChange": "rgb",
      "instantReload": false,
      "showCopy": true,
      "onHexSetAlphaToOne": true,
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
      "selected": "hex", // currently selected type (results)
      currentColor: {
        "hsv":  {"h": 0, "s": 100, "v": 100},
        "alpha": 1
      }
    };

    this.info = {
      "patterns": {
        "hex": /\b#?([0-9A-Fa-f]){6}\b/i,
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
        if(valid.type == "hex"){
          let rgb = this.convert.hexToRgb(input);
          hsv = this.convert.rgbToHsv(rgb.r, rgb.g, rgb.b);
        }
        else if(valid.type == "rgb"){
          let v = this.getNumber(input, "rgb");
          hsv = this.convert.rgbToHsv(v.r, v.g, v.b);
        }
        else if(valid.type == "rgba"){
          let v = this.getNumber(input, "rgba");
          hsv = this.convert.rgbToHsv(v.r, v.g, v.b);
          alpha = v.a;
        }
        else if(valid.type == "hsl"){
          let v = this.getNumber(input, "hsl");
          let rgb = this.convert.hslToRgb(v.h/360, v.s/100, v.l/100);
          hsv = this.convert.rgbToHsv(rgb.r, rgb.g, rgb.b);
        }
        else if(valid.type == "hsla"){
          let v = this.getNumber(input, "hsla");
          let rgb = this.convert.hslToRgb(v.h/360, v.s/100, v.l/100);
          hsv = this.convert.rgbToHsv(rgb.r, rgb.g, rgb.b);
          alpha = v.a;
        }
      } else {
        hsv = this.settings.defaultColor.hsv;
        this.flashMessage("Oops, that value is not valid", "error", 30000);
      }

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
    let pos = this.getPositionAlpha();
    let value = this.getValueAlpha(pos);
    this.printResultsOnlyAlpha(value);
    this.updateCurrentAlpha(value);
    this.onHexAlpha(value);
    this.contrast();
  }
  userClickOnSpectrum(){
    this.session.change = true;
    let pos = this.getPositionSpectrum();
    let value = this.getValueSpectrum(pos);

    this.drawAlpha(value);

    this.printResults(value);
    this.updateCurrentColor(value);
    this.contrast();
  }
  userClickOnHue(){
    this.session.change = true;
    let pos = this.getPositionHue();
    let value = this.getValueHue(pos);

    this.drawSpectrum(value);
    let sPos = this.getPositionSpectrum();
    let spectrumValue = this.getValueSpectrum(sPos);
    this.drawAlpha(spectrumValue);

    this.printResults(spectrumValue);
    this.updateCurrentColor(spectrumValue);
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
        value = this.ele.results.hexView.innerHTML;
        bgValue = this.ele.results.hexView.innerHTML;
      }
      else if (cs == "rgb"){
        value = this.ele.results.rgbView.innerHTML;
        bgValue = this.ele.results.rgbView.innerHTML;
      }
      else if (cs == "hsl"){
        value = this.ele.results.hslView.innerHTML;
        bgValue = this.ele.results.rgbView.innerHTML;
      }
      else {
        value = this.ele.results.rgbView.innerHTML;
        bgValue = this.ele.results.rgbView.innerHTML;
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
      if(valid.type == "hex"){
        let rgb = this.convert.hexToRgb(input);
        hsv = this.convert.rgbToHsv(rgb.r, rgb.g, rgb.b);
        bg = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 1)";
      }
      else if(valid.type == "rgb"){
        let v = this.getNumber(input, "rgb");
        hsv = this.convert.rgbToHsv(v.r, v.g, v.b);
        bg = "rgba(" + v.r + ", " + v.g + ", " + v.b + ", 1)";
      }
      else if(valid.type == "rgba"){
        let v = this.getNumber(input, "rgba");
        hsv = this.convert.rgbToHsv(v.r, v.g, v.b);
        alpha = v.a;
        bg = "rgba(" + v.r + ", " + v.g + ", " + v.b + ", " + v.a + ")";
      }
      else if(valid.type == "hsl"){
        let v = this.getNumber(input, "hsl");
        let rgb = this.convert.hslToRgb(v.h/360, v.s/100, v.l/100);
        hsv = this.convert.rgbToHsv(rgb.r, rgb.g, rgb.b);
        bg = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 1)";
      }
      else if(valid.type == "hsla"){
        let v = this.getNumber(input, "hsla");
        let rgb = this.convert.hslToRgb(v.h/360, v.s/100, v.l/100);
        hsv = this.convert.rgbToHsv(rgb.r, rgb.g, rgb.b);
        alpha = v.a;
        bg = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + v.a + ")";
      }
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


  // print && update results
  printResults(c){
    let rgb = this.convert.hsvToRgb(c.h, c.s, c.v);
    let hsl = this.convert.rgbToHsl(rgb.r, rgb.g, rgb.b);
    let hex = this.convert.rgbToHex(rgb.r, rgb.g, rgb.b);
    let alpha = this.session.currentColor.alpha;

    let rgbaFormated = "rgba(" + rgb.r.toFixed(0) + ", " + rgb.g.toFixed(0) + ", " + rgb.b.toFixed(0) + ", " + alpha.toFixed(2) + ")";
    let hslaFormated = "hsla(" + hsl.h.toFixed(0) + ", " + hsl.s.toFixed(0) + "%, " + hsl.l .toFixed(0)+ "%, " + alpha.toFixed(2) + ")";

    this.ele.results.hexView.innerHTML = hex;
    this.ele.results.hslView.innerHTML = hslaFormated;
    this.ele.results.rgbView.innerHTML = rgbaFormated;

    this.ele.results.object.style.backgroundColor = rgbaFormated;
  }
  printResultsOnlyAlpha(alpha){
    // get current values
    let cRgb = this.ele.results.rgbView.innerHTML;
    let cHsl = this.ele.results.hslView.innerHTML;

    // validate
    let validRgb = this.validateValue((cRgb).trim());
    let validHsl = this.validateValue((cHsl).trim());

    // get numbers
    let rgb = this.getNumber(cRgb, validRgb.type);
    let hsl = this.getNumber(cHsl, validHsl.type);

    // update with new numbers
    let rgbaFormated = "rgba(" + rgb.r.toFixed(0) + ", " + rgb.g.toFixed(0) + ", " + rgb.b.toFixed(0) + ", " + alpha.toFixed(2) + ")";
    let hslaFormated = "hsla(" + hsl.h.toFixed(0) + ", " + hsl.s.toFixed(0) + "%, " + hsl.l .toFixed(0)+ "%, " + alpha.toFixed(2) + ")";

    this.ele.results.hslView.innerHTML = hslaFormated;
    this.ele.results.rgbView.innerHTML = rgbaFormated;

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
      this.flashMessage("This value is not valid", "error", 3000);
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

    target.focus();

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

    setTimeout(() => {
      this.ele.flashMessage.classList.remove("active");
    }, time);
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

  // update current value
  updateCurrentAlpha(c){
    this.session.currentColor.alpha = c;
  }
  updateCurrentColor(c){
    this.session.currentColor.hsv = {"h": c.h, "s": c.s, "v": c.v};
  }

  // get position (return)
  getPositionAlpha(){
    let pos = this.alpha.pos;
    return pos;
  }
  getPositionHue(){
    let pos = this.hue.pos;
    return pos;
  }
  getPositionSpectrum(){
    let pos = this.spectrum.pos;
    return pos;
  }

  // get value (return)
  getValueAlpha(pos){
    let alpha = (pos.y / this.alpha.height * -1 + 1);
    return alpha;
  }
  getValueHue(pos){
    let element = this.hue.object;
    let ctx = element.getContext("2d");
    let resp = ctx.getImageData(pos.x, pos.y, 1, 1);
    let hsv = this.convert.rgbToHsv(resp.data[0], resp.data[1], resp.data[2]);

    return {"h": hsv.h, "s": hsv.s, "v": hsv.v};
  }
  getValueSpectrum(pos){
    let element = this.spectrum.object;
    let ctx = element.getContext("2d");
    let resp = ctx.getImageData(pos.x, pos.y, 1, 1);
    let hsv = this.convert.rgbToHsv(resp.data[0], resp.data[1], resp.data[2]);

    return {"h": hsv.h, "s": hsv.s, "v": hsv.v};
  }

  // draw
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
    grd.addColorStop(0.999, "rgba(255, 0, 0, 1.000)");
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

  // settings
  setting(settings){
    for (var key in settings){
      if (settings.hasOwnProperty(key)) {
        if(key == "defaultColor"){
          let valid = this.validateValue(settings[key]);
          let hsv, alpha = 1;

          if(valid.status == "valid"){
            if(valid.type == "hex"){
              let rgb = this.convert.hexToRgb(settings[key]);
              hsv = this.convert.rgbToHsv(rgb.r, rgb.g, rgb.b);
            }
            else if(valid.type == "rgb"){
              let v = this.getNumber(settings[key], "rgb");
              hsv = this.convert.rgbToHsv(v.r, v.g, v.b);
            }
            else if(valid.type == "rgba"){
              let v = this.getNumber(settings[key], "rgba");
              hsv = this.convert.rgbToHsv(v.r, v.g, v.b);
              alpha = v.a;
            }
            else if(valid.type == "hsl"){
              let v = this.getNumber(settings[key], "hsl");
              let rgb = this.convert.hslToRgb(v.h/360, v.s/100, v.l/100);
              hsv = this.convert.rgbToHsv(rgb.r, rgb.g, rgb.b);
            }
            else if(valid.type == "hsla"){
              let v = this.getNumber(settings[key], "hsla");
              let rgb = this.convert.hslToRgb(v.h/360, v.s/100, v.l/100);
              hsv = this.convert.rgbToHsv(rgb.r, rgb.g, rgb.b);
              alpha = v.a;
            }
          }
          else {
            console.log("Cannot set default value");
          }

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
      this.ele.label.addEventListener("click", () => {
        this.userOpen();
      });
    }
    createInput(){
      this.ele.input.addEventListener("keyup", (e) => {
        if(e.keyCode == 13 || this.settings.instantReload == true){
          this.userInputUpdate();
        }
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
      // bg
      let bg = document.createElement("div");
        bg.setAttribute("class", "colorpicker-bg");
      // container
      let container = document.createElement("div");
        container.setAttribute("class", "colorpicker-container");

        bg.addEventListener("click", () => {
          this.userOpen();
        });

      this.ele.object = wrapper;
      this.ele.container = container;
      // append to
      wrapper.append(bg);
      wrapper.append(container);
      document.body.append(wrapper);
    }
    createResults(){
      // let container
      let container = document.createElement("div");
        container.setAttribute("class", "results");
      // let view
      let view = document.createElement("div");
        view.setAttribute("class", "results-view");
      // let buttons
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

        let hex = document.createElement("div");
          hex.setAttribute("class", "results-view-hex active");
          hex.innerHTML = "HEX";
        let rgb = document.createElement("div");
          rgb.setAttribute("class", "results-view-rgb");
          rgb.innerHTML = "RGBA";
        let hsl = document.createElement("div");
          hsl.setAttribute("class", "results-view-hsl");
          hsl.innerHTML = "HSLA";

        // save to
        this.ele.results.hexView = hex;
        this.ele.results.rgbView = rgb;
        this.ele.results.hslView = hsl;

        // append to
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
          rgb.addEventListener("click", () => {
            this.setResultButton("rgb");
          });
          hsl.addEventListener("click", () => {
            this.setResultButton("hsl");
          });

        // save to
        this.ele.results.hexBtn = hex;
        this.ele.results.rgbBtn = rgb;
        this.ele.results.hslBtn = hsl;

        // append to
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

          // append to
          this.ele.results.object.append(element);
          this.ele.results.copy = element;
        }
      }
    createPickers(){
      let container = document.createElement("div");
        container.setAttribute("class", "pickers");

      // save to
      this.ele.picker = container;

      // append to
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

          spectrum.addEventListener("mousedown", () => { this.session.move = true; });
          spectrum.addEventListener("mouseup", () => { this.session.move = false; });
          spectrum.addEventListener("mouseleave", () => { this.session.move = false; });
          spectrum.addEventListener("mousemove", (e) => {
            if(this.session.move){
              this.spectrum.pos.x = e.layerX;
              this.spectrum.pos.y = e.layerY;
              marker.setAttribute("style", "top: " + (e.layerY) + "px; left: "+ (e.layerX) + "px;");
              this.userClickOnSpectrum();
            }
          });
          spectrum.addEventListener("click", (e) => {
            this.spectrum.pos.x = e.layerX;
            this.spectrum.pos.y = e.layerY;
            marker.setAttribute("style", "top: " + (e.layerY) + "px; left: "+ (e.layerX) + "px;");
            this.userClickOnSpectrum();
          });

          spectrum.addEventListener("touchstart", () => { this.session.move = true; });
          spectrum.addEventListener("touchend", () => { this.session.move = false; });
          spectrum.addEventListener("touchmove", (e) => {
            if(this.session.move){
              this.spectrum.pos.x = e.layerX;
              this.spectrum.pos.y = e.layerY;
              marker.setAttribute("style", "top: " + (e.layerY) + "px; left: "+ (e.layerX) + "px;");
              this.userClickOnSpectrum();
            }
          });

        // save to
        this.spectrum.object = spectrum;
        this.spectrum.marker = marker;

        // append to
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

        hue.addEventListener("mousedown", () => { this.session.move = true; });
        hue.addEventListener("mouseup", () => { this.session.move = false; });
        hue.addEventListener("mouseleave", () => { this.session.move = false; });
        hue.addEventListener("mousemove", (e) => {
          if(this.session.move){
            this.hue.pos.x = e.layerX;
            this.hue.pos.y = e.layerY;
            marker.setAttribute("style", "top: " + (e.layerY) + "px;");
            this.userClickOnHue();
          }
        });
        hue.addEventListener("click", (e) => {
          this.hue.pos.x = e.layerX;
          this.hue.pos.y = e.layerY;
          marker.setAttribute("style", "top: " + (e.layerY) + "px;");
          this.userClickOnHue();
        });

        hue.addEventListener("touchstart", () => { this.session.move = true; });
        hue.addEventListener("touchend", () => { this.session.move = false; });
        hue.addEventListener("touchcancel", () => { this.session.move = false; });
        hue.addEventListener("touchmove", (e) => {
          if(this.session.move){
            this.hue.pos.x = e.layerX;
            this.hue.pos.y = e.layerY;
            marker.setAttribute("style", "top: " + (e.layerY) + "px;");
            this.userClickOnHue();
          }
        });
        // add to
        this.hue.object = hue;
        this.hue.marker = marker;

        // append to
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

          alpha.addEventListener("mousedown", () => { this.session.move = true; });
          alpha.addEventListener("mouseup", () => { this.session.move = false; });
          alpha.addEventListener("mouseleave", () => { this.session.move = false; });
          alpha.addEventListener("mousemove", (e) => {
            if(this.session.move){
              this.alpha.pos.x = e.layerX;
              this.alpha.pos.y = e.layerY;
              marker.setAttribute("style", "top: " + (e.layerY) + "px;");
              this.userClickOnAlpha();
            }
          });
          alpha.addEventListener("click", (e) => {
            this.alpha.pos.x = e.layerX;
            this.alpha.pos.y = e.layerY;
            marker.setAttribute("style", "top: " + (e.layerY) + "px;");
            this.userClickOnAlpha();
          });

          alpha.addEventListener("touchstart", () => { this.session.move = true; });
          alpha.addEventListener("touchend", () => { this.session.move = false; });
          alpha.addEventListener("touchcancel", () => { this.session.move = false; });
          alpha.addEventListener("touchmove", (e) => {
            if(this.session.move){
              this.alpha.pos.x = e.layerX;
              this.alpha.pos.y = e.layerY;
              marker.setAttribute("style", "top: " + (e.layerY) + "px;");
              this.userClickOnAlpha();
            }
          });

        // add to
        this.alpha.object = alpha;
        this.alpha.marker = marker;

        // append to
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

      cancel.addEventListener("click", () => {
        this.userSelect("n");
      });
      select.addEventListener("click", () => {
        this.userSelect("y");
      });

      // save to
      this.ele.cancel = cancel;
      this.ele.select = select;

      // append to
      container.append(cancel);
      container.append(select);
      this.ele.container.append(container);

    }
    createFlashMessage(){
      let container = document.createElement("div");
        container.setAttribute("class", "flashMessage");
        container.innerHTML = "Flash Message";

      // append to
      this.ele.flashMessage = container;
      this.ele.container.append(container);
    }

}
