let canvas, myShader, time;

function preload() {
  // load the myShader
  myShader = loadShader("basic.vert", "sun-dog-solar-halo.frag");
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

  // frameCount as time passed
  myShader.setUniform("time", frameCount);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
