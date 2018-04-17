// IDEA
// Create a div and use the create colorpicker function on it.
// The function will cretae a new colorpicker and return a finished colorpicker to that div.
// Everything is created with javascript.


var colorpicker = ( function(){

  var spectrum = "";
  var hue = "";
  var alpha = "";

  var values = {
    "spectrum": "spectrumData",
    "hue": [0, 0, 0, 1],
    "alpha": "alphaData"
  }

  var createNew = function(ele){
    var canvas = createCanvas();
    var hue   = createHue();
    var c = createControls();

    // append to element
    ele.append(canvas);
    ele.append(hue );

    // return finished colorpicker
    return ele;
  };

  var createCanvas = function(){
    let ele = document.createElement("canvas");
    ele.setAttribute("class", "canvas");
    ele.setAttribute("width", "255");
    ele.setAttribute("height", "255");

    var ctx = ele.getContext('2d');
    var ctx2 = ele.getContext('2d');

    // create color base -> color is from hue
    ctx.fillStyle = "rgba(255, 255, 0, 1";
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

    return ele;
  };

  var createHue = function(){
    let ele = document.createElement("canvas");
    ele.setAttribute("class", "hue");
    ele.setAttribute("width", "30");
    ele.setAttribute("height", "255");

    hue = ele;
    var ctx = ele.getContext('2d');

    // create hue
    ctx.rect(0, 0, 30, 255);
    var grd = ctx.createLinearGradient(0, 0, 0, 300);
    grd.addColorStop(0, 'rgba(255, 0, 0, 1)');
    grd.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    grd.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    grd.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    grd.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    grd.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    grd.addColorStop(1, 'rgba(255, 0, 0, 1)');
    ctx.fillStyle = grd;
    ctx.fill();

    // when you click on the hue -> update values
    ele.addEventListener('click', function(e){
      var coordiantes = { "x": e.layerX, "y": e.layerY };

      var resp = ctx.getImageData(coordiantes.x, coordiantes.y, 1, 1);
      var data = [resp.data[0], resp.data[1], resp.data[2], resp.data[3]];
      hueData = data;
      values.hue = data;

      // updateValues();
    });

    return ele;
  };

  var createControls = function(){

  };

  var updateValues = function(){
    console.log("Update Functions!");
    console.log(values);
    // find all values
    // convert and build values
    // print values
  };

  return { createNew: createNew };

})();






var div = document.getElementById("colorpicker");

var cp = colorpicker.createNew(div);
