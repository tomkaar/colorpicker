class Colorpicker2 {


  constructor(label, input = null) {

    this.settings = {
      "baseColor": "=",
      "selectedOnOpen": "hsl",
      "move": false
    };

    this.elements = {
      "label": label,
      "input": input,
      "loc": "=",
      "results": "=",
      "buttons": "="
    };

    this.info = {
      "currentlySelected" : "hex",
      "colorInput": "=",
      "change": false,
      "open": false
    };

    this.spectrum = {
      "ele": "=",
      "marker": "=",
      "position": { "x": 255, "y": 0 },
      "width": 255,
      "height": 255
    };

    this.hue = {
      "ele": "=",
      "marker": "=",
      "position": { "x": 0, "y": 0 },
      "width": 30,
      "height": 255
    };

    this.alpha = {
      "ele": "=",
      "marker": "=",
      "position": { "x": 255, "y": 0 },
      "width": 30,
      "height": 255
    };

    this.result = {
      "hex": "#ff0000",
      "rgb": [255, 0, 0, 1],
      "hsl": "=",
      "hue": [255, 0, 0, 1],
      "spectrum": [255, 0, 0, 1],
      "alpha": 1
    };

    this.output = {
      "hex": "=",
      "rgb": "=",
      "hsl": "="
    };

    // Create all Elements
    this.create();

  }

  // Create New Elements
  // Run all create metods
  create(){
    this.createBase();
    this.createResults();

    this.createSpectrum();
    this.createHue();
    this.createAlpha();

    this.createButtons();

    this.setSpectrum();
    this.setHue();
    this.setAlpha();
    this.setResults();
  }
    // create foundation
    createBase(){
      // create base div
      let baseDiv = document.createElement("div");
        baseDiv.setAttribute("class", "colorpicker");
      // save div to this.elements so we can use it later
      this.elements.loc = baseDiv;
      // Append div to body
      document.body.append(baseDiv);

      // set label to base
      if(this.elements.input != null){
        this.elements.input.value = this.result.hex;
          // update while typing
        this.elements.input.addEventListener("keyup", (e) => {
          this.findValue();
          // if ENTER -> set value
          if(e.keyCode == 13){
            this.option("y");
          }
        });
      }

      // create toggle on label
      this.elements.label.addEventListener("click", () => {
        this.elements.loc.classList.toggle("active");
        // this.findValue();
      });
    }
    createResults(){

      // create element container
      let ele = document.createElement("div");
        ele.setAttribute("class", "colorBox");

      // create buttons
      let buttons = document.createElement("div");
        buttons.setAttribute("class", "colorBoxBtns");

        let hexButton = document.createElement("button");
          hexButton.innerHTML = "HEX";
          hexButton.setAttribute("class", "active");
        let rgbButton = document.createElement("button");
          rgbButton.innerHTML = "RGBA";
        let hslButton = document.createElement("button");
          hslButton.innerHTML = "HSL";

        hexButton.addEventListener("click", () =>{
          hexDiv.classList.add("active");
          rgbDiv.classList.remove("active");
          hslDiv.classList.remove("active");
          hexButton.classList.add("active");
          rgbButton.classList.remove("active");
          hslButton.classList.remove("active");
          this.info.currentlySelected = "hex";
          // this.updateOutput();
        });
        rgbButton.addEventListener("click", () =>{
          hexDiv.classList.remove("active");
          rgbDiv.classList.add("active");
          hslDiv.classList.remove("active");
          hexButton.classList.remove("active");
          rgbButton.classList.add("active");
          hslButton.classList.remove("active");
          this.info.currentlySelected = "rgb";
          // this.updateOutput();
        });
        hslButton.addEventListener("click", () =>{
          hexDiv.classList.remove("active");
          rgbDiv.classList.remove("active");
          hslDiv.classList.add("active");
          hexButton.classList.remove("active");
          rgbButton.classList.remove("active");
          hslButton.classList.add("active");
          this.info.currentlySelected = "hsl";
          // this.updateOutput();
        });

        let hexDiv = document.createElement("div");
          hexDiv.setAttribute("class", "hexDiv active");

        let rgbDiv = document.createElement("div");
          rgbDiv.setAttribute("class", "rgbDiv");

        let hslDiv = document.createElement("div");
          hslDiv.setAttribute("class", "hslDiv");

        buttons.append(hexButton);
        buttons.append(rgbButton);
        buttons.append(hslButton);


      // Append to Element
      ele.append(hexDiv);
      ele.append(rgbDiv);
      ele.append(hslDiv);
      ele.append(buttons);

      // append to location
      this.elements.loc.append(ele);
      // save in elements
      this.elements.results = ele;
    }
    createButtons(){
      // create container
      let ele = document.createElement("div");
        ele.setAttribute("class", "buttons");

      // create each button
      let cancel = document.createElement("button");
        cancel.innerHTML = "Cancel";
      let confirm = document.createElement("button");
        confirm.innerHTML = "Select";

      cancel.addEventListener("click", () => {
        this.option("n");
      });

      confirm.addEventListener("click", () => {
        this.option("y");
      });

      ele.append(cancel);
      ele.append(confirm);

      this.elements.loc.append(ele);
      this.elements.buttons = ele;
    }
    createSpectrum(){
      // Create
      let div = document.createElement("div");
        div.setAttribute("class", "spectrum container");
        div.setAttribute("width", this.spectrum.width + "px");
        div.setAttribute("height", this.spectrum.height + "px");

      let spectrum = document.createElement("canvas");
        spectrum.setAttribute("width", this.spectrum.width);
        spectrum.setAttribute("height", this.spectrum.height);

      let marker = document.createElement("div");
        marker.setAttribute("class", "spectrumMarker crossMarker");
        marker.setAttribute("style", "top: 0px; left: 245px; ");

      // Eventlistener - when you click on the canvas
      spectrum.addEventListener("mousedown", () => { this.settings.move = true; });
      spectrum.addEventListener("mouseup", () => { this.settings.move = false; });
      spectrum.addEventListener("mouseleave", () => { this.settings.move = false; });
      spectrum.addEventListener("mousemove", (e) => {
        if(this.settings.move){
          // update positon
          let coordiantes = { "x": e.layerX, "y": e.layerY };
          this.spectrum.position.x = coordiantes.x;
          this.spectrum.position.y = coordiantes.y;

          // move marker
          marker.setAttribute("style", "top: " + e.layerY + "px; left: " + e.layerX + "px; ");

          // update properties
          this.updateProperties();
        }
      });
      spectrum.addEventListener("click", (e) => {
        // update positon
        let coordiantes = { "x": e.layerX, "y": e.layerY };
        this.spectrum.position.x = coordiantes.x;
        this.spectrum.position.y = coordiantes.y;

        // move marker
        marker.setAttribute("style", "top: " + e.layerY + "px; left: " + e.layerX + "px; ");

        // update properties
        this.updateProperties();
      });

      // Add to this.spectrum + append to basediv
      this.spectrum.ele = spectrum;
      this.spectrum.marker = marker;
      div.append(spectrum);
      div.append(marker);
      this.elements.loc.append(div);
    }
    createHue(){
      // Create
      let div = document.createElement("div");
        div.setAttribute("class", "hue container");
        div.setAttribute("width", this.hue.width + "px");
        div.setAttribute("height", this.hue.height + "px");

      let hue = document.createElement("canvas");
        hue.setAttribute("width", this.hue.width);
        hue.setAttribute("height", this.hue.height);

      let marker = document.createElement("div");
        marker.setAttribute("class", "spectrumMarker barMarker");
        marker.setAttribute("style", "top: 10px;");

      // Eventlistener - when you click on the canvas
      hue.addEventListener("mousedown", () => { this.settings.move = true; });
      hue.addEventListener("mouseup", () => { this.settings.move = false; });
      hue.addEventListener("mouseleave", () => { this.settings.move = false; });
      hue.addEventListener("mousemove", (e) => {
        if(this.settings.move){
          // update positon
          let coordiantes = { "x": e.layerX, "y": e.layerY };
          this.hue.position.x = coordiantes.x;
          this.hue.position.y = coordiantes.y;

          // move marker
          marker.setAttribute("style", "top: " + (e.layerY) + "px;");

          // update properties
          this.updateProperties();
        }
      });
      hue.addEventListener("click", (e) => {
        // update positon
        let coordiantes = { "x": e.layerX, "y": e.layerY };
        this.hue.position.x = coordiantes.x;
        this.hue.position.y = coordiantes.y;

        // move marker
        marker.setAttribute("style", "top: " + (e.layerY) + "px;");

        // update properties
        this.updateProperties();
      });

      // Add to this.hue + append to basediv
      this.hue.ele = hue;
      this.hue.marker = marker;
      div.append(hue);
      div.append(marker);
      this.elements.loc.append(div);
    }
    createAlpha(){
      // Create
      let div = document.createElement("div");
        div.setAttribute("class", "alpha container");
        div.setAttribute("width", this.alpha.width + "px");
        div.setAttribute("height", this.alpha.height + "px");

      let alpha = document.createElement("canvas");
        alpha.setAttribute("width", this.alpha.width);
        alpha.setAttribute("height", this.alpha.height);

      let marker = document.createElement("div");
        marker.setAttribute("class", "spectrumMarker barMarker");
        marker.setAttribute("style", "top: 10px;");

      // Eventlistener - when you click on the canvas
      alpha.addEventListener("mousedown", () => { this.settings.move = true; });
      alpha.addEventListener("mouseup", () => { this.settings.move = false; });
      alpha.addEventListener("mouseleave", () => { this.settings.move = false; });
      alpha.addEventListener("mousemove", (e) => {
        if(this.settings.move){
          // update positon
          let coordiantes = { "x": e.layerX, "y": e.layerY };
          this.alpha.position.x = coordiantes.x;
          this.alpha.position.y = coordiantes.y;

          // move marker
          marker.setAttribute("style", "top: " + (e.layerY) + "px;");

          // update properties
          this.updateProperties();
        }
      });
      alpha.addEventListener("click", (e) => {
        // update positon
        let coordiantes = { "x": e.layerX, "y": e.layerY };
        this.alpha.position.x = coordiantes.x;
        this.alpha.position.y = coordiantes.y;

        // move marker
        marker.setAttribute("style", "top: " + (e.layerY) + "px;");

        // update properties
        this.updateProperties();
      });

      // Add to this.spectrum + append to basediv
      this.alpha.ele = alpha;
      this.alpha.marker = marker;
      div.append(alpha);
      div.append(marker);
      this.elements.loc.append(div);
    }

    // set && update the visible elements
    setSpectrum(){
      // get color from this.result
      let color = this.result.hue;
      // get spectrum element
      let ele = this.spectrum.ele;

      var ctx = ele.getContext("2d");
      var ctx2 = ele.getContext("2d");

      ctx.clearRect(-1, -1, 1, 1);
      ctx2.clearRect(-1, -1, 1, 1);

      let rgba = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 1)";
      let hsl = convert.rgbToHsl(color[0], color[1], color[2]);
      let hslColor = "hsl(" + hsl[0] + ", 100%, 50%)";
      console.log(hslColor);

      // create background with selected color from hue
      ctx.fillStyle = rgba;
      ctx.fillRect(0, 0, 255, 255);

      // create white gradient
      var grdWhite = ctx2.createLinearGradient(0, 0, 255, 0);
      grdWhite.addColorStop(.01, "rgba(255,255,255,1)");
      grdWhite.addColorStop(.99, "rgba(255,255,255,0)");
      ctx.fillStyle = grdWhite;
      ctx.fillRect(-1, -1, 257, 257);

      // create black gradient
      var grdBlack = ctx2.createLinearGradient(0, 0, 0, 255);
      grdBlack.addColorStop(.01, "rgba(0,0,0,0)");
      grdBlack.addColorStop(.99, "rgba(0,0,0,1)");
      ctx.fillStyle = grdBlack;
      ctx.fillRect(-1, -1, 257, 257);

    }
    setHue(){
      let ele = this.hue.ele;
      let ctx = ele.getContext("2d");

      ctx.rect(0, 0, 30, 255);
      var grd = ctx.createLinearGradient(90, 0, 90, 255);
      // grd.addColorStop(.01, "rgba(255, 0, 0, 1.000)");
      // grd.addColorStop(.167, "rgba(255, 0, 255, 1.000)");
      // grd.addColorStop(.333, "rgba(0, 0, 255, 1.000)");
      // grd.addColorStop(.5, "rgba(0, 255, 255, 1.000)");
      // grd.addColorStop(.666, "rgba(0, 255, 0, 1.000)");
      // grd.addColorStop(.832, "rgba(255, 255, 0, 1.000)");
      // grd.addColorStop(.999, "rgba(255, 0, 0, 1.000)");
      grd.addColorStop(.01, "rgba(255, 0, 0, 1.000)");
      grd.addColorStop(.167, "rgba(255, 0, 255, 1.000)");
      grd.addColorStop(.333, "rgba(0, 0, 255, 1.000)");
      grd.addColorStop(.5, "rgba(0, 255, 255, 1.000)");
      grd.addColorStop(.666, "rgba(0, 255, 0, 1.000)");
      grd.addColorStop(.833, "rgba(255, 255, 0, 1.000)");
      grd.addColorStop(0.999, "rgba(255, 0, 0, 1.000)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 255, 255);
      ctx.fill();
    }
    setAlpha(){
      let color = this.result.hue;
      let ele = this.alpha.ele;
      let ctx = ele.getContext("2d");

      ctx.clearRect(0, 0, 30, 255);

      let rgba1 = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 1)";
      let rgba2 = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 0)";

      ctx.rect(0, 0, 30, 255);
      let grd = ctx.createLinearGradient(0, 0, 0, 255);
        grd.addColorStop(0,  rgba1);
        grd.addColorStop(1, rgba2);
      ctx.fillStyle = grd;
      ctx.fill();
    }
    setResults(){
      // Get color
      let color = this.result.spectrum;
      let alpha = this.result.alpha;

      let hexData = convert.rgbToHex(color[0], color[1], color[2]);
      let hslData = convert.rgbToHsl(color[0], color[1], color[2]);

      let hex = hexData;
      let hsla = "hsla(" + hslData[0].toFixed(0) + ", " + hslData[1].toFixed(0) + "%, " + hslData[2].toFixed(0) + "%, " + alpha.toFixed(2) + ")";
      let rgba = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + alpha.toFixed(2) + ")";


      // Find Contrast
      let c = [ color[0]/255, color[1]/255, color[2]/255 ];
      let newColor = "";
      for ( let i = 0; i < c.length; ++i ) {
        if ( c[i] <= 0.03928 ) {
          c[i] = c[i] / 12.92;
        } else {
          c[i] = Math.pow( ( c[i] + 0.055 ) / 1.055, 2.4);
        }
      }

      let l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      if ( l > 0.179 ) {
        newColor = "#000000";
      } else {
        newColor = "#ffffff";
      }

      // Update BG
      let ele = this.elements.results;
        ele.style.background = rgba;

      // Update text
      ele.children[0].innerHTML = hex;
      ele.children[1].innerHTML = rgba;
      ele.children[2].innerHTML = hsla;

      ele.children[0].style.color = newColor;
      ele.children[1].style.color = newColor;
      ele.children[2].style.color = newColor;

      let buttons = this.elements.results.querySelectorAll("button");
      for(let button of buttons){
        button.style.color = newColor;
      }

      // Update this.results
      this.result.hex = hex;
      this.result.rgb = [color[0], color[1], color[2], alpha];
      this.result.hsl = [hslData[0], hslData[1], hslData[2], alpha];
    }

    // get values - find value based on position
    getHueValues(){
      let ele = this.hue.ele;
      let pos = this.hue.position;
      let ctx = ele.getContext("2d");

      var t = Math.max(0, Math.min(t, 255 - 1));
      console.log(t);

      let coordiantes = { "x": pos.x, "y": pos.y };
      let resp = ctx.getImageData(coordiantes.x, coordiantes.y, 1, 1);
      let data = [resp.data[0], resp.data[1], resp.data[2], resp.data[3]];

      this.result.hue = data;
    }
    getSpectrumValues(){
      let ele = this.spectrum.ele;
      let pos = this.spectrum.position;
      let ctx = ele.getContext("2d");

      let coordiantes = { "x": pos.x, "y": pos.y };
      let resp = ctx.getImageData(coordiantes.x, coordiantes.y, 1, 1);
      let data = [resp.data[0], resp.data[1], resp.data[2], resp.data[3]];

      this.result.spectrum = data;
    }
    getAlphaValues(){
      let ele = this.alpha.ele;
      let pos = this.alpha.position;

      let height = ele.height;
      let currentPos = pos.y;
      let percentage = (currentPos / height * -1 + 1);

      this.result.alpha = percentage;
    }

    // Update Output
    updateProperties(){
      this.getHueValues();

      this.setSpectrum();
      this.setAlpha();

      this.getSpectrumValues();
      this.getAlphaValues();

      this.setResults();
    }

    // when you click on the cancel or select
    option(answer){

      // if "y" == if user clicked on selected
      if(answer == "y"){
        var value = "";
        var bgValue = "";

        // find currentlySelected
        let c = this.info.currentlySelected;
        if(c == "hex"){
          value = this.result.hex;
          bgValue = this.result.hex;
        }
        if(c == "rgb"){
          value = "rgba(" + this.result.rgb[0].toFixed(0) + ", " + this.result.rgb[1].toFixed(0) + ", " + this.result.rgb[2].toFixed(0) + ", " + this.result.rgb[3].toFixed(2) + ")";
          bgValue = "rgba(" + this.result.rgb[0].toFixed(0) + ", " + this.result.rgb[1].toFixed(0) + ", " + this.result.rgb[2].toFixed(0) + ", " + this.result.rgb[3].toFixed(2) + ")";
        }
        if(c == "hsl"){
          value = "hsla(" + this.result.hsl[0].toFixed(0) + ", " + this.result.hsl[1].toFixed(0) + "%, " + this.result.hsl[2].toFixed(0) + "%, " + this.result.hsl[3].toFixed(2) + ")";
          bgValue = "rgba(" + this.result.rgb[0].toFixed(0) + ", " + this.result.rgb[1].toFixed(0) + ", " + this.result.rgb[2].toFixed(0) + ", " + this.result.rgb[3].toFixed(2) + ")";
        }

        // update input + label
        if(this.elements.input != null){
          this.elements.input.value = value;
        }
        this.elements.label.style.backgroundColor = bgValue;
      }

      // close
      this.elements.loc.classList.remove("active");

    }

    // when user opens colorpicker find current value
    // convert value to hsva -> setPosition()
    findValue(){
      if(this.elements.input != null){
        // find value
        let value = this.elements.input.value;

        // convert value
        let newValue = this.validValue(value);

        this.setPosition(newValue.h, newValue.s, newValue.v, newValue.a);

      }

    }

    // set colorpicker to match value -> updateProperties()
    setPosition(h, s, v, a){

      // update Hue
      let hueMarker = this.hue.marker;
      let hue = 255 - (255 * (h / 360));

      if(h == 255){ hue = hue - 10; }
      if(h == 0){ hue = hue - 0.6; }

      this.hue.position.y = hue;
      hueMarker.style.top = hue + "px";

      // update alpha
      let alphaMarker = this.alpha.marker;
      let alpha = 255 - (255 * a);

      if(a == 255){ alpha = alpha - 0.6; }
      if(a == 0){ alpha = alpha - 0.6; }

      this.alpha.position.y = alpha.toFixed(0);
      alphaMarker.style.top = alpha.toFixed(0) + "px";

      // update spectrum
      let marker = this.spectrum.marker;

      let coordiantes = {
        "x": 255 * (s / 100 ),
        "y": 255 * ((100 - v) / 100)
      };

      // let newXValue = coordiantes.x - 0.00005;
      // let newYValue = coordiantes.y + 0.00005;
      //
      // if(coordiantes.x == 255) { coordiantes.x = newXValue; }
      // if(coordiantes.y == 0) { coordiantes.y = newYValue; }

      marker.style.left = coordiantes.x + "px";
      marker.style.top = coordiantes.y + "px";

      this.spectrum.position.x = coordiantes.x;
      this.spectrum.position.y = coordiantes.y;

      // update properties with the new values
      this.updateProperties();
    }

    // set the initial value
    setValue(color){
      if(this.elements.input != null){
        // if input value is valid
        let valid = this.validValue(color);
        // set position value -> updateProperties
        this.setPosition(valid.h, valid.s, valid.v, valid.a);
        this.option("y");
      }
    }

    // validValue - check in input valid and return hsla
    validValue(value){

      var hex = /\b#?([0-9A-Fa-f]){6}\b/g;
      var rgb = /([R][G][B][(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])[)]);?/i;
      var rgba = /([R][G][B][A][(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{0,300})|(0)|(1\.[0-9]{0,300})|(1)))[)]);?/i;
      var hsl = /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\);?/g;
      var hsla = /hsla\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?)\);?/g;

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
        // if value is not valid -> set to black
        let data = {"h": 255, "s": 255, "v": 255, "a": 0};
        newValue = data;
      }

      return newValue;
    }





    // When you open the colorpicker
    onOpen(){
      // If this.info.open is false
      if(this.info.open == false){
        console.log("Is false / Closed");
        // set this.info.change to false
        // open
        // find input value
        // Update results from Value
        // Update Spectrum from Value
      }
      // else (if true)
      else {
        console.log("Is true/ Open");
        // set this.info.open to false
        // close
      }
    }

    // When you click on the Spectrum/ Hue or Alpha
    onClick(){
      // set this.info.change to true
      // Update Spectrum
      // Update Values from Spectrum
      // Update this.output.XX (hex, rgb, hsl)
    }

    // When you type and the colorpicker is closed
    onTypeClosed(){
      // set this.info.change to false
      // Update Label Color
    }

    // When you type and the colorpicker is open
    onTypeOpen(){
      // set this.info.change to true
      // Update Spectrum
      // Update
    }

    // When you click on Cancel or Select
    clickOption(/* answer */){
      // If Cancel && this.info.change is true
        // set this.info.change to false
        // set this.info.open to false

      // If Cancel && this.info.change is false
        // set this.info.open to false

      // If Select && this.info.change is true
        // Print selected value from this.output.XX
        // set this.info.change to false
        // set this.info.open to false

      // If Select && this.info.change is false
        // set this.info.open to false
    }


}






var convert = ( function(){

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

    return [ h, s, l ];
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
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
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

    return { "r" : Number(r * 255), "g": Number(g * 255), "b": Number(b * 255) };
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

  return {
    rgbToHsl: rgbToHsl,
    rgbToHex: rgbToHex,
    hexToRgb: hexToRgb,
    hslToRgb: hslToRgb,
    rgbToHsv: rgbToHsv
  };

})();





var label = document.getElementById("colorpicker-label");
var input = document.getElementById("colorpicker-input");

var cp = new Colorpicker2(label, input);
cp.setValue("hsla(208, 100%, 50%, 1.00)");



//
// How it's gonna work
//

// // When you open the colorpicker
// onOpen(){
//   // If this.info.open is false
//     // set this.info.change to false
//     // find input value
//     // Update results from Value
//     // Update Spectrum from Value
// }
//
// // When you click on the Spectrum/ Hue or Alpha
// onClick(){
//   // set this.info.change to true
//   // Update Spectrum
//   // Update Values from Spectrum
//   // Update this.output.XX (hex, rgb, hsl)
// }
//
// // When you type and the colorpicker is closed
// onTypeClosed(){
//   // set this.info.change to false
//   // Update Label Color
// }
//
// // When you type and the colorpicker is open
// onTypeOpen(){
//   // set this.info.change to true
//   // Update Spectrum
//   // Update
// }
//
// // When you click on Cancel or Select
// clickOption(/* answer */){
//   // If Cancel && this.info.change is true
//     // set this.info.change to false
//     // set this.info.open to false
//
//   // If Cancel && this.info.change is false
//     // set this.info.open to false
//
//   // If Select && this.info.change is true
//     // Print selected value from this.output.XX
//     // set this.info.change to false
//     // set this.info.open to false
//
//   // If Select && this.info.change is false
//     // set this.info.open to false
// }
