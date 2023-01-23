let theShader;

let img1, img2, maskImg;

function preload() {
  // load the shader
  theShader = loadShader("basic.vert", "image-masking.frag");

  // load the images
  img1 = loadImage("../../images/stock-1-1024x1024-with-guidelines.jpg");
  img2 = loadImage(
    "../../images/stock-1-1024x1024-with-guidelines-inverted.jpg"
  );
  maskImg = loadImage("../../images/sun-fence-1024x1024.jpg");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  // set the active shader
  shader(theShader);

  theShader.setUniform("landscapeTex1", img1);
  theShader.setUniform("landscapeTex2", img2);
  theShader.setUniform("maskImgTex", maskImg);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
