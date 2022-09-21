let aspectRatioShader, img;

function preload() {
  // load the shader
  aspectRatioShader = loadShader(
    "aspect-fit-fill.vert",
    "aspect-fit-fill.frag"
  );

  // load the image
  img = loadImage("../../images/stock-1-1920x1080-with-guidelines.jpg");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes("alpha", true);
  noStroke();
}

function draw() {
  // set the active shader
  shader(aspectRatioShader);

  // Image
  aspectRatioShader.setUniform("texture", img);

  // Canvas dimensions
  aspectRatioShader.setUniform("canvasResolution", [width, height]);

  // Texture dimensions
  aspectRatioShader.setUniform("textureResolution", [img.width, img.height]);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
