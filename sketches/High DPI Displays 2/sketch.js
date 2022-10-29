let canvas, myShader, time;

function preload() {
  // load the myShader
  myShader = loadShader("basic.vert", "high-dpi-example-2.frag");

  // load the image
  img = loadImage("../../images/seaweed-green.jpg");
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

  // texture
  myShader.setUniform("texture", img);
  myShader.setUniform("textureResolution", [img.width, img.height]);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
