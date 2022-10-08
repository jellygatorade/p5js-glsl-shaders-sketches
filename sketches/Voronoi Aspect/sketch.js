let simpleShader;

function preload() {
  simpleShader = loadShader("basic.vert", "voronoi-aspect.frag");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  // shader() sets the active shader with our shader
  shader(simpleShader);

  // lets just send frameCount to the shader as a way to control animation over time
  simpleShader.setUniform("time", frameCount);

  // and the canvas dimensions
  simpleShader.setUniform("canvasResolution", [width, height]);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
