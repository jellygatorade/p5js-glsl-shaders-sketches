let canvas, myShader;

function preload() {
  // load the myShader
  myShader = loadShader("basic.vert", "mouse-position-dot.frag");
}

function setup() {
  // myShaders require WEBGL mode to work
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes("alpha", true);
  noStroke();
}

function draw() {
  // set the active shader
  shader(myShader);

  // Canvas dimensions
  myShader.setUniform("canvasResolution", [width, height]);

  // send the mouse values to the shader as a vec2
  // map them so that they go from 0 - 1
  // flip y coordinates so that bottom left is (0,0) as with glsl
  let mx = map(mouseX, 0, width, 0, 1);
  let my = map(mouseY, 0, height, 1, 0);
  myShader.setUniform("mouse", [mx, my]);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
