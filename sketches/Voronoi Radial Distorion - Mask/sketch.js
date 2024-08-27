let theShader;
let img1, img2;

function preload() {
  // theShader = loadShader("basic.vert", "voronoi-radial-distortion.frag");
  theShader = loadShader("glsl-aspect-fit-fill.vert", "voronoi-radial-distortion.frag");

  // load the images
  img1 = loadImage("../../images/lofoten-red-horizon.jpg");
  // img2 = loadImage(
  //   "../../images/grass-erosion.jpg"
  // );

  // img1 = loadImage("../../images/duke-forest.jpg");
  img2 = loadImage(
    "../../images/wetland-cloud.jpg"
  );
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  // shader() sets the active shader with our shader
  shader(theShader);

  // lets just send frameCount to the shader as a way to control animation over time
  theShader.setUniform("time", frameCount);

  // Canvas dimensions
  theShader.setUniform("canvasResolution", [width, height]);

  // Texture dimensions
  theShader.setUniform("texture1Resolution", [img1.width, img1.height]);
  theShader.setUniform("texture2Resolution", [img2.width, img2.height]);

  // and the images
  theShader.setUniform("tex1", img1);
  theShader.setUniform("tex2", img2);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
