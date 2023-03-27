let canvas, myShader;

function preload() {
  // load the shader
  myShader = loadShader("basic.vert", "spiral-texture.frag");

  // load image
  //img0 = loadImage("../../images/stock-1-1024x1024-with-guidelines.jpg");
  //img0 = loadImage("../../images/seaweed-green-1024x1024.jpg");
  img0 = loadImage("../../images/3djungle-grass-tile-400x400.jpg");
  //img0 = loadImage("../../images/3djungle-path-tile-400x400.jpg");
  //img0 = loadImage("../../images/3djungle-neon-desert-tile-400x400.jpg");
}

function setup() {
  // myShaders require WEBGL mode to work
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  //setAttributes("alpha", true);
  noStroke();

  tex0 = new p5.Texture(canvas, img0); // does not need wrap mode because shader uses fract()

  // tex0.setWrapMode(REPEAT, REPEAT);
  // tex0 = new p5.Texture(canvas, img0, {
  //   wrapS: REPEAT,
  //   wrapT: REPEAT,
  // });
}

function draw() {
  // set the active shader
  shader(myShader);

  // frameCount as time passed
  myShader.setUniform("time", frameCount);

  // Canvas dimensions
  myShader.setUniform("canvasResolution", [width, height]);

  // textures
  myShader.setUniform("tex0", tex0);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
