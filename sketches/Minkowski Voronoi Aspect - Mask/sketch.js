let simpleShader, img1, img2;

function preload() {
  simpleShader = loadShader(
    "glsl-aspect-fit-fill.vert",
    "minkowski-voronoi-aspect-mask.frag"
  );

  // load the image
  img1 = loadImage("../../images/duke-forest.jpg");
  // img1 = loadImage("../../images/sun-fence.jpg");
  img2 = loadImage("../../images/colorado-tree.jpg");
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

  // Image
  simpleShader.setUniform("texture1", img1);
  simpleShader.setUniform("texture2", img2);

  // Texture dimensions
  simpleShader.setUniform("texture1Resolution", [img1.width, img1.height]);
  simpleShader.setUniform("texture2Resolution", [img2.width, img2.height]);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
