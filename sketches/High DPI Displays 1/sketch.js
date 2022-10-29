let canvas, myShader, time;

function preload() {
  // load the myShader
  myShader = loadShader("basic.vert", "high-dpi-example-1.frag");
}

function setup() {
  // shaders require WEBGL mode to work
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  //noStroke();
}

function draw() {
  // set the active shader
  shader(myShader);

  // Device Pixel Ratio
  myShader.setUniform("devicePixelRatio", window.devicePixelRatio);

  // Canvas dimensions
  myShader.setUniform("canvasResolution", [width, height]);

  // frameCount as time passed
  myShader.setUniform("time", frameCount);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
