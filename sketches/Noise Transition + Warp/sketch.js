let theShader;

let img1, img2;
let p5tex1, p5tex2;

function preload() {
  // load the shader
  theShader = loadShader("basic.vert", "noise-transition-warp.frag");

  // load the images
  // img1 = loadImage("../../images/stock-1-1024x1024-with-guidelines.jpg");
  // img2 = loadImage(
  //   "../../images/stock-1-1024x1024-with-guidelines-inverted.jpg"
  // );
  img1 = loadImage("../../images/sun-fence-1024x1024.jpg");
  img2 = loadImage("../../images/seaweed-green-1024x1024.jpg");
}

function setup() {
  // shaders require WEBGL mode to work
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Example of using the new p5.Texture() operator at https://github.com/processing/p5.js/issues/5556
  p5tex1 = new p5.Texture(canvas, img1, {
    wrapS: REPEAT,
    wrapT: REPEAT,
  });

  p5tex2 = new p5.Texture(canvas, img2, {
    wrapS: REPEAT,
    wrapT: REPEAT,
  });
}

function draw() {
  // set the active shader
  shader(theShader);

  theShader.setUniform("imgTex1", p5tex1);
  theShader.setUniform("imgTex2", p5tex2);

  // send frameCount to the shader as a way to control animation over time
  theShader.setUniform("time", frameCount);

  // and the canvas dimensions
  theShader.setUniform("canvasResolution", [width, height]);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
