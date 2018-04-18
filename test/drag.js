

let spectrumParent = document.getElementById("spectrum-parent");
let spectrumMarker = document.getElementById("spectrum-marker");

let alphaParent = document.getElementById("alpha-parent");
let alphaMarker = document.getElementById("alpha-marker");



let spectrumClick = false;
let alphaClick = false;



spectrumParent.addEventListener("mousedown", () => { spectrumClick = true; });
document.body.addEventListener("mouseup", () => {
  spectrumClick = false;
  spectrumClick = false;
});

document.body.addEventListener("mousemove", (e) => {
  if(spectrumClick){ updatePosition(e, spectrumParent, spectrumMarker); }
});

spectrumParent.addEventListener("click", (e) => {
  updatePosition(e, spectrumParent, spectrumMarker);
});






alphaParent.addEventListener("mousedown", () => { alphaClick = true; });
document.body.addEventListener("mouseup", () => {
  alphaClick = false;
  alphaClick = false;
});

document.body.addEventListener("mousemove", (e) => {
  if(alphaClick){ updatePosition(e, alphaParent, alphaMarker, "x"); }
});

alphaParent.addEventListener("click", (e) => {
  updatePosition(e, alphaParent, alphaMarker, "x");
});



function updatePosition(t, e, m, d = "both"){
  // mouse position
  let c = { "x": t.clientX - e.offsetLeft, "y": t.clientY - e.offsetTop };
  // marker position
  let pos = { "x": 10, "y": 10 };

  // inside
  if( c.x >= 0 && c.y >= 0 && c.x <= e.offsetWidth && c.y <= e.offsetHeight){ pos = {"x": c.x, "y": c.y}; }
  // top left corner
  else if(c.x <= 0 && c.y <= 0) { pos = {"x": 0, "y": 0}; }
  // top right corner
  else if(c.x >= e.offsetWidth && c.y <= 0){ pos = {"x": e.offsetWidth, "y": 0}; }
  // bottom right corner
  else if(c.x >= e.offsetWidth && c.y >= e.offsetHeight){ pos = {"x": e.offsetWidth, "y": e.offsetHeight}; }
  // bottom left corner
  else if(c.x <= 0 && c.y >= e.offsetHeight){ pos = {"x": 0, "y": e.offsetHeight}; }
  // bottom side
  else if(c.y >= e.offsetHeight){ pos = {"x": c.x, "y": e.offsetHeight}; }
  // right side
  else if(c.x >= e.offsetWidth && c.y >= 0){ pos = {"x": e.offsetWidth, "y": c.y}; }
  // top side
  else if(c.x >= 0) { pos = {"x": c.x, "y": 0}; }
  // left side
  else if(c.y >= 0) { pos = {"x": 0, "y": c.y}; }

  // set marker position
  if(d == "both"){ m.setAttribute("style", "top: " + pos.y + "px; left: " + pos.x + "px;"); }
  else if (d == "x"){ m.setAttribute("style", "top: " + pos.y + "px; left: 0px;"); }
  else if (d == "y"){ m.setAttribute("style", "top: 0px; left: " + pos.x + "px;"); }

}
