

class ColorPicker {
  constructor(label, input, settings = null) {

    // defult stuff to make the application run
    this.settings = {
      "baseColor": "=",
      "selectedOnOpen": "hsl",
      "move": false,
      "onHexAlpha": "rgb"
    };
    this.default = {
      "hex": "#ff0000",
      "rgb": "rgba(255, 0, 0, 1)",
      "hsl": "hsla(0, 100%, 50%, 1)"
    };
    this.info = {
      "currentlySelected" : "hex",
      "colorInput": "=",
      "change": false,
      "open": false
    };

    // elements we can refer to when we need them later
    this.elements = {
      "label": label,
      "input": input,
      "object": "=",
      "colorpicker": "=",
      "results": "=",
      "buttons": "="
    };

    // Store result from when updating the canvas
    this.result = {
      "hex": "#ff0000",
      "rgb": [255, 0, 0, 1],
      "hsl": "=",
      "hue": [255, 0, 0, 1],
      "spectrum": [255, 0, 0, 1],
      "alpha": 1
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

    // create object
    this.create();
    if(settings != null){ this.setting(settings); }
  }

  // create colorpicker
  create(){
    this.createBase();
    this.createResults();

    this.createSpectrum();
    this.createHue();
    this.createAlpha();

    this.createButtons();

    this.updateSpectrum();
    this.updateHue();
    this.updateAlpha();
    this.updateResults();
  }
    createBase(){

      // create base div
      let full = document.createElement("div");
        full.setAttribute("class", "colorpicker");
      // save div to this.elements so we can use it later
      this.elements.object = full;
      // Append div to body
      document.body.append(full);

      // create bg
      let bg = document.createElement("div");
        bg.setAttribute("class", "colorpicker-bg");
        bg.addEventListener("click", () => {
          this.clickOption("n");
        });
      this.elements.object.append(bg);

      // create base div
      let baseDiv = document.createElement("div");
        baseDiv.setAttribute("class", "cp");
      // save div to this.elements so we can use it later
      this.elements.colorpicker = baseDiv;
      // Append div to body
      full.append(baseDiv);

      // set label to base
      this.elements.input.value = this.default.hex;

      // create toggle on label (open/ close)
      this.elements.label.addEventListener("click", () => {
        this.onOpen();
      });

      // when you type -> click enter to update
      this.elements.input.addEventListener("keyup", (e) => {
        if(e.keyCode == 13){
          this.onTypeInput();
        }
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
          this.info.change = true;
        });
        rgbButton.addEventListener("click", () =>{
          hexDiv.classList.remove("active");
          rgbDiv.classList.add("active");
          hslDiv.classList.remove("active");
          hexButton.classList.remove("active");
          rgbButton.classList.add("active");
          hslButton.classList.remove("active");
          this.info.currentlySelected = "rgb";
          this.info.change = true;
        });
        hslButton.addEventListener("click", () =>{
          hexDiv.classList.remove("active");
          rgbDiv.classList.remove("active");
          hslDiv.classList.add("active");
          hexButton.classList.remove("active");
          rgbButton.classList.remove("active");
          hslButton.classList.add("active");
          this.info.currentlySelected = "hsl";
          this.info.change = true;
        });

        let hexDiv = document.createElement("div");
          hexDiv.setAttribute("class", "hexDiv active");

        let rgbDiv = document.createElement("div");
          rgbDiv.setAttribute("class", "rgbDiv");

        let hslDiv = document.createElement("div");
          hslDiv.setAttribute("class", "hslDiv");

          let copy = document.createElement("button");
            copy.innerHTML = "copy";
            copy.setAttribute("class", "copy");
            copy.addEventListener("click", () =>{
              // for some reason you have to fire this twice for something to happen
              this.copyValue();
              this.copyValue();
            });

        buttons.append(hexButton);
        buttons.append(rgbButton);
        buttons.append(hslButton);


      // Append to Element
      ele.append(hexDiv);
      ele.append(rgbDiv);
      ele.append(hslDiv);
      ele.append(buttons);

      ele.append(copy);

      // append to colorpicker
      this.elements.colorpicker.append(ele);
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
        this.clickOption("n");
      });

      confirm.addEventListener("click", () => {
        this.clickOption("y");
      });

      ele.append(cancel);
      ele.append(confirm);

      this.elements.colorpicker.append(ele);
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
          this.onClick();
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
        this.onClick();
      });

      // Add to this.spectrum + append to basediv
      this.spectrum.ele = spectrum;
      this.spectrum.marker = marker;
      div.append(spectrum);
      div.append(marker);
      this.elements.colorpicker.append(div);
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
          this.onClick();
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
        this.onClick();
      });

      // Add to this.hue + append to basediv
      this.hue.ele = hue;
      this.hue.marker = marker;
      div.append(hue);
      div.append(marker);
      this.elements.colorpicker.append(div);
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
          // this.onClick();
            this.getAlphaValues();
            this.updateOnlyAlpha();
          this.onHexAlpha();
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
        // this.onClick();
          this.getAlphaValues();
          this.updateOnlyAlpha();
        this.onHexAlpha();
      });

      // Add to this.spectrum + append to basediv
      this.alpha.ele = alpha;
      this.alpha.marker = marker;
      div.append(alpha);
      div.append(marker);
      this.elements.colorpicker.append(div);
    }

  // set && update the visible elements
  updateSpectrum(){
    // get color from this.result
    let color = this.result.hue;
    // get spectrum element
    let ele = this.spectrum.ele;

    var ctx = ele.getContext("2d");
    var ctx2 = ele.getContext("2d");

    ctx.clearRect(-1, -1, 1, 1);
    ctx2.clearRect(-1, -1, 1, 1);

    let rgba = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 1)";

    // create background with selected color from hue
    ctx.fillStyle = rgba;
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
  updateHue(){
    let ele = this.hue.ele;
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
  updateAlpha(){
    let color = this.result.hue;
    let ele = this.alpha.ele;
    let ctx = ele.getContext("2d");

    ctx.clearRect(0, 0, this.alpha.width, this.alpha.height);

    let rgba1 = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 1)";
    let rgba2 = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 0)";

    ctx.rect(0, 0, 30, 255);
    let grd = ctx.createLinearGradient(0, 0, 0, this.alpha.height);
      grd.addColorStop(0,  rgba1);
      grd.addColorStop(1, rgba2);
    ctx.fillStyle = grd;
    ctx.fill();
  }
  updateResults(){
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

  updateOnlyAlpha(){
    let alpha = this.result.alpha;

    // get current input from
    let box = this.elements.results;
    let current = box.children[1].innerHTML;

    // if valid
    let valid = this.validValue(current);
    let rgb = convert.hsvToRgb(valid.h, valid.s, valid.v);
    let hsl = convert.rgbToHsl(rgb[0], rgb[1], rgb[2]);

    // set rgb and hsl
    box.children[1].innerHTML = "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + alpha.toFixed(2) + ")";
    box.children[2].innerHTML = "hsla(" + hsl[0].toFixed(0) + ", " + hsl[1].toFixed(0) + "%, " + hsl[2].toFixed(0) + "%, " + alpha.toFixed(2) + ")";

    // set BG
    box.style.background = "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + alpha.toFixed(2) + ")";
  }

  // Get values
  getHueValues(){
    let ele = this.hue.ele;
    let pos = this.hue.position;
    let ctx = ele.getContext("2d");

    var t = Math.max(0, Math.min(t, 255 - 1));

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

  // Check if value is valid and return the hsv version of that value
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
      let data = {"h": hsv.h, "s": hsv.s, "v": hsv.v, "a": Number(d[3])};

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
      let data = {"h": hsv.h, "s": hsv.s, "v": hsv.v, "a": Number(d[3])};

      newValue = data;
    }
    else {
      // if value is not valid -> set to black
      let data = {"h": 255, "s": 255, "v": 255, "a": 0};
      newValue = data;
    }

    return newValue;
  }

  // From values functions
  updateResultsFromValue(v){

    let color = convert.hsvToRgb(v.h, v.s, v.v);

    let hex = convert.rgbToHex(color[0], color[1], color[2]);
    let hslData = convert.rgbToHsl(color[0], color[1], color[2]);

    let hsla = "hsla(" + hslData[0].toFixed(0) + ", " + hslData[1].toFixed(0) + "%, " + hslData[2].toFixed(0) + "%, " + v.a.toFixed(2) + ")";
    let rgba = "rgba(" + color[0] + ", " + color[1]+ ", " + color[2] + ", " + v.a.toFixed(2) + ")";

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

    let ele = this.elements.results;
      ele.style.background = rgba;

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

  }
  updateVisibleFromValue(v){

    // use hsv to set position on canvas
    this.setPositionFromValue(v.h, v.s, v.v, v.a);

    // get value from the current position on canvas
    this.getHueValues();

    // Need a updated hue value to run these
    this.updateSpectrum();
    this.updateAlpha();

    // update so we keep everything the same
    this.getSpectrumValues();
    this.getAlphaValues();
  }
  setPositionFromValue(h, s, v, a){

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
    // this.updateProperties();
  }

  setCurrentlySelected(selected){
    let buttons = this.elements.results.querySelector(".colorBoxBtns");
    let div = this.elements.results;

    if(selected == "hex"){
      buttons.children[0].classList.add("active");
      buttons.children[1].classList.remove("active");
      buttons.children[2].classList.remove("active");
      div.children[0].classList.add("active");
      div.children[1].classList.remove("active");
      div.children[2].classList.remove("active");
      this.info.currentlySelected = "hex";
    }
    else if(selected == "rgb"){
      buttons.children[0].classList.remove("active");
      buttons.children[1].classList.add("active");
      buttons.children[2].classList.remove("active");
      div.children[0].classList.remove("active");
      div.children[1].classList.add("active");
      div.children[2].classList.add("active");
      div.children[2].classList.remove("active");
      this.info.currentlySelected = "rgb";
    }
    else if(selected == "hsl"){
      buttons.children[0].classList.remove("active");
      buttons.children[1].classList.remove("active");
      buttons.children[2].classList.add("active");
      div.children[0].classList.remove("active");
      div.children[1].classList.remove("active");
      div.children[2].classList.add("active");
      this.info.currentlySelected = "hsl";
    }
    this.info.change = true;
  }

  // copy current value from output
  copyValue(){

    let c = this.info.currentlySelected;
    let a;

    if(c == "hex") { a = this.elements.results.children[0]; }
    else if(c == "rgb") { a = this.elements.results.children[1]; }
    else if(c == "hsl") { a = this.elements.results.children[2]; }

    a.focus();

    var range = document.createRange();
    range.selectNode(a);
    window.getSelection().addRange(range);

    try {
      document.execCommand("copy");
    }
    catch(err) {
      console.log("Oops, unable to copy");
    }

    window.getSelection().removeAllRanges();
  }

  // When you open/ close the colorpicker
  onOpen(){
    if(this.info.open == false){
      this.info.change = false;
      this.info.open = true;
      this.elements.object.classList.add("active");

      // set currently selected
      this.setCurrentlySelected(this.info.currentlySelected);

      let input = this.elements.input.value;
      let valid = this.validValue(input);

      this.updateResultsFromValue(valid);
      this.updateVisibleFromValue(valid);

    }
    else {
      this.info.open = false;
      this.elements.object.classList.remove("active");
    }
  }

  onHexAlpha(a = this.settings.onHexAlpha){
    if(this.info.currentlySelected == "hex"){
      this.settings.onHexAlpha = a;

      this.setCurrentlySelected(a);
      this.info.change = true;
    }
  }

  // When you click on the Spectrum/ Hue or Alpha
  onClick(){
    this.info.change = true;

    // Update spectrum
    this.getHueValues();

    this.updateSpectrum();
    this.updateAlpha();

    this.getSpectrumValues();
    this.getAlphaValues();

    // update results
    this.updateResults();
  }

  // When you type and the colorpicker is closed
  onTypeInput(){
    this.info.change = false;
    let input = this.elements.input.value;
    let valid = this.validValue(input);
    let rgb = convert.hsvToRgb(valid.h, valid.s, valid.v);
    let color = "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + valid.a + ")";

    this.elements.label.style.backgroundColor = color;
  }

  // When you type and the colorpicker is open
  onTypeOpen(){
    // set this.info.change to true
    // Update Spectrum
    // Update
  }

  setting(settings){
    // console.log(settings);
    for (var key in settings){
      if (settings.hasOwnProperty(key)) {
        // console.log("Key is " + key + ", value is " + settings[key]);
        if(key == "defaultColor"){
          this.elements.label.style.backgroundColor = settings[key];
          this.elements.input.value = settings[key];
          // get color
          let valid = this.validValue(settings[key]);
          let rgb = convert.hsvToRgb(valid.h, valid.s, valid.v);
          let hex = convert.rgbToHex(rgb[0], rgb[1], rgb[2]);
          let hsl = convert.rgbToHsl(rgb[0], rgb[1], rgb[2]);
          let alpha = 1;

          // update result
          this.default.hex = hex;
          this.result.hex = hex;
          this.result.rgb = [rgb[0], rgb[1], rgb[2], alpha];
          this.result.hsl = [hsl[0], hsl[1], hsl[2], alpha];
        }
        else if (key == "defaultSelection"){
          this.info.currentlySelected = settings[key];
        }
        else if (key == "defaultHexAlphaChange"){
          this.settings.onHexAlpha = settings[key];
          // this.onHexAlpha(settings[key]);
        }
      }
    }
    this.info.change = true;
    this.clickOption("y"); // update - put changes into action
  }

  // When you click on Cancel or Select
  clickOption(answer = "n"){
    if(answer == "n" && this.info.change == true){
      this.info.change = false;
      this.info.open = false;
      this.elements.object.classList.remove("active");
    }
    else if (answer == "n" && this.info.change == false){
      this.info.open = false;
      this.elements.object.classList.remove("active");
    }
    else if(answer == "y" && this.info.change == true){
      let cs = this.info.currentlySelected;
      let input = this.elements.input;
      let label = this.elements.label;

      let value = "";
      let bgValue = "";

      if(cs == "hex"){
        value = this.result.hex;
        bgValue = this.result.hex;
      }
      else if (cs == "rgb"){
        let a = this.result.rgb;
        let b = this.result.alpha;
        value = "rgba(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + b.toFixed(2) + ")";
        bgValue = "rgba(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + b.toFixed(2) + ")";
      }
      else if (cs == "hsl"){
        let a = this.result.hsl;
        let b = this.result.rgb;
        let c = this.result.alpha;
        value = "hsla(" + a[0].toFixed(0) + ", " + a[1].toFixed(0) + "%, " + a[2].toFixed(0) + "%, " + c.toFixed(2) + ")";
        bgValue = "rgba(" + b[0] + ", " + b[1] + ", " + b[2] + ", " + c.toFixed(2) + ")";
      }
      else {
        value = this.result.hex;
        bgValue = this.result.hex;
      }

      input.value = value;
      label.style.backgroundColor = bgValue;

      this.info.change = false;
      this.info.open = false;
      this.elements.object.classList.remove("active");
    }
    else if(answer == "y" && this.info.change == false){
      this.info.open = false;
      this.elements.object.classList.remove("active");
    }
  }
}


// Convert one value to another
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
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
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

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
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



var label = document.getElementById("colorpicker-label");
var input = document.getElementById("colorpicker-input");
var settings = {
  "defaultColor": "#565656",
  "defaultSelection": "hsl",
  "defaultHexAlphaChange": "rgb"
};

var cp = new ColorPicker(label, input, settings);
console.log(cp);


// Settings
  // Default color
  // Error color
  // default selection
  // alpha on hex change to


// ToDo
  // Remove alpha from updating Spectrum

















// SAVE

// const DOM = {
//   get: function(id){
//     return document.getElementById(id);
//   }
// };
// const button = DOM.get("button");
