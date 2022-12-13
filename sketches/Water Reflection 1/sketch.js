let wrShader, img;

function preload() {
  // load the shader
  wrShader = loadShader("water-reflection.vert", "water-reflection.frag");

  // load the image
  //img = loadImage("word-1024x1024.png");
  //img = loadImage("ed-ruscha-mint-512x512.jpg");
  img = loadImage("../../images/seaweed-green-1024x1024.jpg");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  // REPEAT and MIRROR are only available if the texture is a power of two size (128, 256, 512, 1024, etc.).
  //textureWrap(MIRROR);
  textureWrap(REPEAT);
  //setAttributes("alpha", true);
  noStroke();
}

function draw() {
  // shader() sets the active shader with our shader
  shader(wrShader);

  // setUniform can send various data to the shader

  // frameCount as time passed
  wrShader.setUniform("time", frameCount);

  // Image
  wrShader.setUniform("texture1", img);

  // Canvas dimensions
  wrShader.setUniform("canvasResolution", [width, height]);

  // Texture dimensions
  wrShader.setUniform("textureResolution", [img.width, img.height]);

  // lets send the mouse values to the shader as a vec2
  // first we will map them so that they go from 0 - 1
  let mx = map(mouseX, 0, width, 0, 1);
  let my = map(mouseY, 0, height, 0, 1);
  wrShader.setUniform("mouse", [mx, my]);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
