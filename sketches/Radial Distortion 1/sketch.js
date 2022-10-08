let canvas, myShader, time;

function preload() {
  // load the myShader
  myShader = loadShader("basic.vert", "radial-distortion-1.frag");

  // load the image
  img = loadImage("../../images/stock-1-1024x1024-with-guidelines.jpg");
}

function setup() {
  // myShaders require WEBGL mode to work
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  //setAttributes("alpha", true);
  // REPEAT and MIRROR are only available if the texture is a power of two size (128, 256, 512, 1024, etc.).
  //textureWrap(MIRROR);
  textureWrap(REPEAT);
  //noStroke();
}

function draw() {
  // set the active shader
  shader(myShader);

  // Image
  myShader.setUniform("texture", img);

  // Canvas dimensions
  myShader.setUniform("canvasResolution", [width, height]);

  // frameCount as time passed
  myShader.setUniform("time", frameCount);

  // send the mouse values to the shader as a vec2
  // map them so that they go from -1 to 1
  // flip y coordinates so that bottom left is (0,0) as with glsl
  let mx = map(mouseX, 0, width, -1, 1);
  let my = map(mouseY, 0, height, 1, -1);
  myShader.setUniform("mouse", [mx, my]);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
