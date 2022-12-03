let simpleShader;

function preload() {
  simpleShader = loadShader("basic.vert", "basic-voronoi-aspect-mouse.frag");
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

  // send the mouse values to the shader as a vec2
  // map them so that they go from 0 - 1
  // flip y coordinates so that bottom left is (0,0) as with glsl
  let mx = map(mouseX, 0, width, 0, 1);
  let my = map(mouseY, 0, height, 1, 0);
  simpleShader.setUniform("mouse", [mx, my]);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
