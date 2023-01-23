let mainShader, img, img1, img2;

function preload() {
  // load the shader
  mainShader = loadShader(
    "glsl-aspect-fit-fill.vert",
    "glsl-voronoi-mask.frag"
  );

  // load the image
  //img = loadImage("stock-1-1920x1080-with-guidelines.jpg");
  img1 = loadImage("../../images/seaweed-green.jpg");
  img2 = loadImage("../../images/sun-fence.jpg");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  // shader() sets the active shader with our shader
  shader(mainShader);

  // setUniform can send various data to the shader

  // frameCount as time passed
  mainShader.setUniform("time", frameCount);

  // Image
  //mainShader.setUniform("texture", img);
  mainShader.setUniform("texture1", img1);
  mainShader.setUniform("texture2", img2);

  // Canvas dimensions
  mainShader.setUniform("canvasResolution", [width, height]);

  // Texture dimensions
  //mainShader.setUniform("textureResolution", [img.width, img.height]);
  mainShader.setUniform("texture1Resolution", [img1.width, img1.height]);
  mainShader.setUniform("texture2Resolution", [img2.width, img2.height]);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
